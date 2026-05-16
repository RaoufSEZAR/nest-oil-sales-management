"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const invoice_entity_1 = require("../erp/entities/invoice.entity");
const payment_entity_1 = require("../erp/entities/payment.entity");
const expense_entity_1 = require("../erp/entities/expense.entity");
let HrService = class HrService {
    constructor(users, invoices, payments, expenses) {
        this.users = users;
        this.invoices = invoices;
        this.payments = payments;
        this.expenses = expenses;
    }
    getHrSettings() {
        return this.users.find({
            where: { isActive: true },
            relations: { center: true },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                role: true,
                centerId: true,
                isActive: true,
                baseSalary: true,
                commissionRate: true,
                commissionBasis: true,
                center: { id: true, name: true, code: true },
            },
            order: { firstName: "ASC", lastName: "ASC" },
        });
    }
    async updateHrSettings(userId, dto) {
        const user = await this.users.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
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
    async getMonthlyPayroll(month) {
        if (!/^\d{4}-\d{2}$/.test(month)) {
            throw new common_1.BadRequestException("Invalid month format (YYYY-MM)");
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
                where: { date: (0, typeorm_2.Between)(new Date(fromDate), new Date(toDate)) },
                relations: { salesRep: true },
            }),
            this.payments.find({
                where: { paymentDate: (0, typeorm_2.Between)(new Date(fromDate), new Date(toDate)) },
                relations: { receivedBy: true },
            }),
            this.expenses.find({
                where: {
                    category: "رواتب",
                    date: (0, typeorm_2.Between)(fromDate, toDate),
                },
            }),
        ]);
        const repPerf = {};
        for (const inv of invoices) {
            const rid = inv.salesRep?.id;
            if (!rid)
                continue;
            if (!repPerf[rid])
                repPerf[rid] = { sales: 0, cash: 0 };
            repPerf[rid].sales += parseFloat(inv.totalAmount || "0");
            const cur = (inv.currency || "USD").toUpperCase();
            const rate = parseFloat(inv.exchangeRate || "1");
            const paid = parseFloat(inv.paidAmount || "0");
            repPerf[rid].cash += cur === "USD" ? paid : paid / rate;
        }
        for (const p of payments) {
            const rid = p.receivedBy?.id;
            if (!rid)
                continue;
            if (!repPerf[rid])
                repPerf[rid] = { sales: 0, cash: 0 };
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
                .filter((e) => e.description?.includes(displayName) ||
                e.description?.includes(u.firstName))
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
        const totals = payroll.reduce((s, r) => ({
            total_due: s.total_due + r.total_due,
            paid_this_month: s.paid_this_month + r.paid_this_month,
            remaining: s.remaining + r.remaining,
        }), { total_due: 0, paid_this_month: 0, remaining: 0 });
        return {
            month,
            from_date: fromDate,
            to_date: toDate,
            payroll,
            totals,
            paid_salaries: paidSalaries,
        };
    }
};
exports.HrService = HrService;
exports.HrService = HrService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(3, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], HrService);
//# sourceMappingURL=hr.service.js.map