import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InventoryTransfer } from "src/erp/entities/inventory-transfer.entity";
import { TransferItem } from "src/erp/entities/transfer-item.entity";
import {
	CreateInventoryTransferDto,
	UpdateInventoryTransferDto,
} from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { TransferStatus } from "src/erp/enums/transfer-status.enum";
import { User } from "src/users/entities/user.entity";

function dec4(n: number): string {
	return n.toFixed(4);
}

@Injectable()
export class ErpInventoryTransfersService {
	constructor(
		@InjectRepository(InventoryTransfer)
		private readonly transfers: Repository<InventoryTransfer>,
		@InjectRepository(TransferItem)
		private readonly items: Repository<TransferItem>,
		private readonly sequences: SequenceService,
	) {}

	findAll(): Promise<InventoryTransfer[]> {
		return this.transfers.find({
			order: { id: "DESC" },
			relations: {
				transferredBy: true,
				receivedBy: true,
				items: { product: true },
			},
		});
	}

	async findOne(id: number): Promise<InventoryTransfer> {
		const row = await this.transfers.findOne({
			where: { id },
			relations: {
				transferredBy: true,
				receivedBy: true,
				items: { product: true },
			},
		});
		if (!row) throw new NotFoundException(`Inventory transfer ${id} not found`);
		return row;
	}

	async create(dto: CreateInventoryTransferDto): Promise<InventoryTransfer> {
		const transferNumber = await this.sequences.next("TRF");
		const transfer = this.transfers.create({
			transferNumber,
			fromLocationType: dto.fromLocationType,
			fromLocationId: dto.fromLocationId,
			toLocationType: dto.toLocationType,
			toLocationId: dto.toLocationId,
			date: dto.date.slice(0, 10),
			transferredBy: dto.transferredById
				? ({ id: dto.transferredById } as User)
				: undefined,
			receivedBy: dto.receivedById
				? ({ id: dto.receivedById } as User)
				: undefined,
			status: dto.status ?? TransferStatus.PENDING,
			notes: dto.notes ?? null,
			completedAt: null,
		});
		await this.transfers.save(transfer);

		for (const line of dto.items) {
			const item = this.items.create({
				transfer: { id: transfer.id },
				product: { id: line.productId },
				quantity: dec4(line.quantity),
			});
			await this.items.save(item);
		}

		return this.findOne(transfer.id);
	}

	async update(
		id: number,
		dto: UpdateInventoryTransferDto,
	): Promise<InventoryTransfer> {
		const row = await this.findOne(id);
		if (dto.status !== undefined) row.status = dto.status;
		if (dto.receivedById !== undefined) {
			row.receivedBy = dto.receivedById
				? ({ id: dto.receivedById } as User)
				: null;
		}
		if (dto.completedAt !== undefined)
			row.completedAt = dto.completedAt ? new Date(dto.completedAt) : null;
		if (dto.notes !== undefined) row.notes = dto.notes ?? null;
		await this.transfers.save(row);
		return this.findOne(id);
	}
}
