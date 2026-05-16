import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { UpdateHrSettingsDto } from "src/users/dto/update-hr-settings.dto";
import { Invoice } from "src/erp/entities/invoice.entity";
import { Payment } from "src/erp/entities/payment.entity";
import { Expense } from "src/erp/entities/expense.entity";

@Injectable()
export class HrService {
	constructor(
		@InjectRepository(User) private readonly users: Repository<User>,
		@InjectRepository(Invoice) private readonly invoices: Repository<Invoice>,
		@InjectRepository(Payment) private readonly payments: Repository<Payment>,
		@InjectRepository(Expense) private readonly expenses: Repository<Expense>,
	) {}

	getHrSettings() {
		return this.users.find({
			where: { isActive: true },
			select: [
				"id",
				"firstName",
				"lastName",
				"phoneNumber",
				"role",
				"centerId",
				"isActive",
				"baseSalary",
				"commissionRate",
				"commissionBasis",
			],
			order: { firstName: "ASC", lastName: "ASC" },
		});
	}

	async updateHrSettings(userId: string, dto: UpdateHrSettingsDto) {
		const user = await this.users.findOne({ where: { id: userId } });
		if (!user) throw new NotFoundException("User not found");

		if (dto.base_salary !== undefined) {
			user.baseSalary = String(dto.base_salary);
		}
		if (dto.commission_rate !== undefined) {
			user.commissionRate = String(dto.commission_rate);
		}
		if (dto.commission_basis !== undefined) {
			user.commissionBasis = dto.commission_basis;
		}

		await this.users.save(user);
		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			baseSalary: user.baseSalary,
			commissionRate: user.commissionRate,
			commissionBasis: user.commissionBasis,
		};
	}

	async getMonthlyPayroll(month: string) {
		if (!/^\d{4}-\d{2}$/.test(month)) {
			throw new BadRequestException("Invalid month format (YYYY-MM)");
		}

		const [year, mon] = month.split("-").map(Number);
		const fromDate = new Date(year, mon - 1, 1).toISOString().slice(0, 10);
		const toDate = new Date(year, mon, 0).toISOString().slice(0, 10);

		const [users, invoices, payments, paidSalaries] = await Promise.all([
			this.users.find({
				where: { isActive: true },
				order: { firstName: "ASC" },
			}),
			this.invoices.find({
				where: { date: Between(new Date(fromDate), new Date(toDate)) },
				relations: { salesRep: true },
			}),
			this.payments.find({
				where: { paymentDate: Between(new Date(fromDate), new Date(toDate)) },
				relations: { receivedBy: true },
			}),
			this.expenses.find({
				where: {
					category: "رواتب",
					date: Between(fromDate, toDate),
				},
			}),
		]);

		const repPerf: Record<
			string,
			{ sales: number; cash: number }
		> = {};

		for (const inv of invoices) {
			const rid = inv.salesRep?.id;
			if (!rid) continue;
			if (!repPerf[rid]) repPerf[rid] = { sales: 0, cash: 0 };
			repPerf[rid].sales += parseFloat(inv.totalAmount || "0");
			const cur = (inv.currency || "USD").toUpperCase();
			const rate = parseFloat(inv.exchangeRate || "1");
			const paid = parseFloat(inv.paidAmount || "0");
			repPerf[rid].cash += cur === "USD" ? paid : paid / rate;
		}

		for (const p of payments) {
			const rid = p.receivedBy?.id;
			if (!rid) continue;
			if (!repPerf[rid]) repPerf[rid] = { sales: 0, cash: 0 };
			repPerf[rid].cash += parseFloat(p.amountUsd || p.amount || "0");
		}

		const payroll = users.map((u) => {
			const perf = repPerf[u.id] || { sales: 0, cash: 0 };
			const baseSalary = parseFloat(u.baseSalary || "0");
			const commRate = parseFloat(u.commissionRate || "0") / 100;
			const basis = u.commissionBasis || "sales";
			const baseAmount = basis === "cash" ? perf.cash : perf.sales;
			const commission = baseAmount * commRate;
			const totalDue = baseSalary + commission;
			const displayName = `${u.firstName} ${u.lastName}`.trim();

			const paid = paidSalaries
				.filter(
					(e) =>
						e.description?.includes(displayName) ||
						e.description?.includes(u.firstName),
				)
				.reduce((s, e) => s + parseFloat(e.amountUsd || "0"), 0);

			return {
				id: u.id,
				name: displayName,
				role: u.role,
				center_id: u.centerId,
				base_salary: baseSalary,
				commission_rate: parseFloat(u.commissionRate || "0"),
				commission_basis: basis,
				sales: perf.sales,
				cash_collected: perf.cash,
				commission,
				total_due: totalDue,
				paid_this_month: paid,
				remaining: Math.max(0, totalDue - paid),
			};
		});

		const totals = payroll.reduce(
			(s, r) => ({
				total_due: s.total_due + r.total_due,
				paid_this_month: s.paid_this_month + r.paid_this_month,
				remaining: s.remaining + r.remaining,
			}),
			{ total_due: 0, paid_this_month: 0, remaining: 0 },
		);

		return {
			month,
			from_date: fromDate,
			to_date: toDate,
			payroll,
			totals,
			paid_salaries: paidSalaries,
		};
	}
}
