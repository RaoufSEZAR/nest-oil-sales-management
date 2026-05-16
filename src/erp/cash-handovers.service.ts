import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CashHandover } from "src/erp/entities/cash-handover.entity";
import {
	CreateCashHandoverDto,
	UpdateCashHandoverDto,
} from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { CashHandoverStatus } from "src/erp/enums/cash-handover-status.enum";
import { User } from "src/users/entities/user.entity";

function dec4(n: number): string {
	return n.toFixed(4);
}

@Injectable()
export class ErpCashHandoversService {
	constructor(
		@InjectRepository(CashHandover)
		private readonly repo: Repository<CashHandover>,
		private readonly sequences: SequenceService,
	) {}

	findAll(): Promise<CashHandover[]> {
		return this.repo.find({
			order: { id: "DESC" },
			relations: { handedBy: true, receivedBy: true },
		});
	}

	async findOne(id: number): Promise<CashHandover> {
		const row = await this.repo.findOne({
			where: { id },
			relations: { handedBy: true, receivedBy: true },
		});
		if (!row) throw new NotFoundException(`Cash handover ${id} not found`);
		return row;
	}

	async create(dto: CreateCashHandoverDto): Promise<CashHandover> {
		const handoverNumber = await this.sequences.next("CH");
		const entity = this.repo.create({
			handoverNumber,
			fromType: dto.fromType,
			fromId: dto.fromId,
			toType: dto.toType,
			toId: dto.toId,
			amount: dec4(dto.amount),
			originalCurrency: dto.originalCurrency ?? "USD",
			originalAmount:
				dto.originalAmount !== undefined ? dec4(dto.originalAmount) : null,
			handoverDate: new Date(dto.handoverDate),
			handedBy: { id: dto.handedById } as User,
			notes: dto.notes ?? null,
			status: CashHandoverStatus.PENDING,
			confirmedAt: null,
		});
		return this.repo.save(entity);
	}

	async update(id: number, dto: UpdateCashHandoverDto): Promise<CashHandover> {
		const row = await this.findOne(id);
		if (dto.status !== undefined) row.status = dto.status;
		if (dto.receivedById !== undefined) {
			row.receivedBy = dto.receivedById
				? ({ id: dto.receivedById } as User)
				: null;
		}
		if (dto.confirmedAt !== undefined)
			row.confirmedAt = dto.confirmedAt ? new Date(dto.confirmedAt) : null;
		if (dto.notes !== undefined) row.notes = dto.notes ?? null;
		return this.repo.save(row);
	}

	async confirm(id: number, receivedById?: string): Promise<CashHandover> {
		const row = await this.findOne(id);
		row.status = CashHandoverStatus.CONFIRMED;
		row.confirmedAt = new Date();
		if (receivedById) row.receivedBy = { id: receivedById } as User;
		return this.repo.save(row);
	}

	async reject(id: number, notes?: string): Promise<CashHandover> {
		const row = await this.findOne(id);
		row.status = CashHandoverStatus.REJECTED;
		row.confirmedAt = new Date();
		if (notes) row.notes = [row.notes, notes].filter(Boolean).join("\n");
		return this.repo.save(row);
	}

	findFiltered(filters?: {
		from_type?: string;
		from_id?: number;
		to_type?: string;
		to_id?: number;
		status?: CashHandoverStatus;
	}): Promise<CashHandover[]> {
		const where: Record<string, unknown> = {};
		if (filters?.from_type) where.fromType = filters.from_type;
		if (filters?.from_id) where.fromId = filters.from_id;
		if (filters?.to_type) where.toType = filters.to_type;
		if (filters?.to_id) where.toId = filters.to_id;
		if (filters?.status) where.status = filters.status;

		return this.repo.find({
			where,
			order: { handoverDate: "DESC" },
			relations: { handedBy: true, receivedBy: true },
		});
	}
}
