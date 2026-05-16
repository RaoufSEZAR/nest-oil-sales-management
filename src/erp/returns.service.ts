import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import { dateRangeWhere } from "src/common/utils/query-filters";
import { SalesReturnStatus } from "src/erp/enums/sales-return-status.enum";
import { Customer } from "src/erp/entities/customer.entity";
import { SalesReturn } from "src/erp/entities/sales-return.entity";
import { ReturnItem } from "src/erp/entities/return-item.entity";
import { CreateSalesReturnDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { ReturnItemCondition } from "src/erp/enums/return-item-condition.enum";
import { User } from "src/users/entities/user.entity";
import { ProductsService } from "src/products/products.service";

function dec2(n: number): string {
	return n.toFixed(2);
}

function toPgDate(iso: string): string {
	return iso.slice(0, 10);
}

@Injectable()
export class ErpReturnsService {
	constructor(
		@InjectRepository(SalesReturn)
		private readonly returns: Repository<SalesReturn>,
		private readonly dataSource: DataSource,
		private readonly sequences: SequenceService,
		private readonly productsService: ProductsService,
	) {}

	findAll(filters?: {
		customer_id?: number;
		sales_rep_id?: string;
		return_type?: string;
		status?: SalesReturnStatus;
		from_date?: string;
		to_date?: string;
	}): Promise<SalesReturn[]> {
		const where: FindOptionsWhere<SalesReturn> = {};
		if (filters?.customer_id) where.customer = { id: filters.customer_id };
		if (filters?.sales_rep_id) where.salesRep = { id: filters.sales_rep_id };
		if (filters?.return_type) where.returnType = filters.return_type as never;
		if (filters?.status) where.status = filters.status;
		const dateFilter = dateRangeWhere(filters?.from_date, filters?.to_date);
		if (dateFilter) where.date = dateFilter;

		return this.returns.find({
			where,
			order: { id: "DESC" },
			relations: {
				customer: true,
				salesRep: true,
				originalInvoice: true,
				items: { product: true },
			},
		});
	}

	async findOne(id: number): Promise<SalesReturn> {
		const row = await this.returns.findOne({
			where: { id },
			relations: {
				customer: true,
				salesRep: true,
				originalInvoice: true,
				items: { product: true },
			},
		});
		if (!row) throw new NotFoundException(`Return ${id} not found`);
		return row;
	}

	async create(dto: CreateSalesReturnDto): Promise<SalesReturn> {
		let total = 0;
		for (const line of dto.items) {
			total += line.quantity * line.unitPrice;
		}

		return this.dataSource.transaction(async (em) => {
			const returnNumber = await this.sequences.next("RET");
			const ret = em.create(SalesReturn, {
				returnNumber,
				returnType: dto.returnType,
				originalInvoice: dto.originalInvoiceId
					? { id: dto.originalInvoiceId }
					: undefined,
				customer: { id: dto.customerId },
				salesRep: { id: dto.salesRepId } as User,
				date: toPgDate(dto.date),
				totalAmount: dec2(total),
				reason: dto.reason ?? null,
				notes: dto.notes ?? null,
				status: SalesReturnStatus.PENDING,
				synced: false,
			});
			await em.save(ret);

			for (const line of dto.items) {
				const lineTotal = line.quantity * line.unitPrice;
				const item = em.create(ReturnItem, {
					salesReturn: { id: ret.id },
					product: { id: line.productId },
					quantity: dec2(line.quantity),
					unitPrice: dec2(line.unitPrice),
					total: dec2(lineTotal),
					condition: line.condition ?? ReturnItemCondition.GOOD,
					reasonDetail: line.reasonDetail ?? null,
				});
				await em.save(item);
			}

			return em.findOneOrFail(SalesReturn, {
				where: { id: ret.id },
				relations: {
					customer: true,
					salesRep: true,
					originalInvoice: true,
					items: { product: true },
				},
			});
		});
	}

	async updateStatus(
		id: number,
		status: SalesReturnStatus,
		managerNotes?: string,
	): Promise<SalesReturn> {
		if (!Object.values(SalesReturnStatus).includes(status)) {
			throw new BadRequestException("Invalid return status");
		}

		return this.dataSource.transaction(async (em) => {
			const row = await em.findOne(SalesReturn, {
				where: { id },
				relations: {
					customer: true,
					items: { product: true },
				},
			});
			if (!row) throw new NotFoundException(`Return ${id} not found`);
			if (row.status !== SalesReturnStatus.PENDING) {
				throw new BadRequestException("Return already processed");
			}

			if (status === SalesReturnStatus.APPROVED) {
				const customer = row.customer as Customer;
				customer.balance = (
					parseFloat(customer.balance || "0") +
					parseFloat(row.totalAmount || "0")
				).toFixed(4);
				await em.save(customer);

				for (const line of row.items ?? []) {
					const productId = line.product?.id;
					if (!productId) continue;
					await this.productsService.increaseStock(
						productId,
						parseFloat(line.quantity),
						em,
					);
				}
			}

			row.status = status;
			if (managerNotes !== undefined) {
				row.notes = [row.notes, managerNotes].filter(Boolean).join("\n");
			}
			await em.save(row);

			return em.findOneOrFail(SalesReturn, {
				where: { id },
				relations: {
					customer: true,
					salesRep: true,
					originalInvoice: true,
					items: { product: true },
				},
			});
		});
	}

	async getReport(filters?: {
		from_date?: string;
		to_date?: string;
		status?: SalesReturnStatus;
	}) {
		const status = filters?.status ?? SalesReturnStatus.APPROVED;
		const rows = await this.findAll({
			status,
			from_date: filters?.from_date,
			to_date: filters?.to_date,
		});

		const byProduct: Record<
			number,
			{ product_id: number; name: string; total_qty: number; total_amount: number }
		> = {};

		for (const ret of rows) {
			for (const line of ret.items ?? []) {
				const pid = line.product?.id;
				if (!pid) continue;
				if (!byProduct[pid]) {
					byProduct[pid] = {
						product_id: pid,
						name: line.product?.name ?? "",
						total_qty: 0,
						total_amount: 0,
					};
				}
				byProduct[pid].total_qty += parseFloat(line.quantity);
				byProduct[pid].total_amount += parseFloat(line.total);
			}
		}

		const productReport = Object.values(byProduct);
		return {
			stats: {
				total_returns: rows.length,
				total_amount: rows.reduce(
					(s, r) => s + parseFloat(r.totalAmount || "0"),
					0,
				),
				total_items: productReport.reduce((s, p) => s + p.total_qty, 0),
			},
			by_product: productReport,
			returns: rows.slice(0, 50),
		};
	}
}
