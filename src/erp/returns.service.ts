import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { SalesReturn } from "src/erp/entities/sales-return.entity";
import { ReturnItem } from "src/erp/entities/return-item.entity";
import { CreateSalesReturnDto } from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { ReturnItemCondition } from "src/erp/enums/return-item-condition.enum";
import { User } from "src/users/entities/user.entity";

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
	) {}

	findAll(): Promise<SalesReturn[]> {
		return this.returns.find({
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
}
