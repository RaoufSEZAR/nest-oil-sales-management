import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { InventoryTransfer } from "src/erp/entities/inventory-transfer.entity";
import { TransferItem } from "src/erp/entities/transfer-item.entity";
import {
	CreateInventoryTransferDto,
	UpdateInventoryTransferDto,
} from "src/erp/dto/documents.dto";
import { SequenceService } from "src/erp/sequence.service";
import { TransferStatus } from "src/erp/enums/transfer-status.enum";
import { User } from "src/users/entities/user.entity";
import { ProductsService } from "src/products/products.service";

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
		private readonly dataSource: DataSource,
		private readonly productsService: ProductsService,
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
		const status = dto.status ?? TransferStatus.PENDING;

		return this.dataSource.transaction(async (em) => {
			const transfer = em.create(InventoryTransfer, {
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
				status,
				notes: dto.notes ?? null,
				completedAt: null,
			});
			await em.save(transfer);

			for (const line of dto.items) {
				const item = em.create(TransferItem, {
					transfer: { id: transfer.id },
					product: { id: line.productId },
					quantity: dec4(line.quantity),
				});
				await em.save(item);
				if (status === TransferStatus.COMPLETED) {
					await this.productsService.decreaseStock(
						line.productId,
						line.quantity,
						em,
					);
				}
			}

			return em.findOneOrFail(InventoryTransfer, {
				where: { id: transfer.id },
				relations: {
					transferredBy: true,
					receivedBy: true,
					items: { product: true },
				},
			});
		});
	}

	async update(
		id: number,
		dto: UpdateInventoryTransferDto,
	): Promise<InventoryTransfer> {
		const previous = await this.transfers.findOne({
			where: { id },
			relations: { items: { product: true } },
		});
		if (!previous) {
			throw new NotFoundException(`Inventory transfer ${id} not found`);
		}
		const wasCompleted = previous.status === TransferStatus.COMPLETED;

		return this.dataSource.transaction(async (em) => {
			const row = await em.findOne(InventoryTransfer, {
				where: { id },
				relations: { items: { product: true } },
			});
			if (!row) {
				throw new NotFoundException(`Inventory transfer ${id} not found`);
			}

			if (dto.status !== undefined) row.status = dto.status;
			if (dto.receivedById !== undefined) {
				row.receivedBy = dto.receivedById
					? ({ id: dto.receivedById } as User)
					: null;
			}
			if (dto.completedAt !== undefined) {
				row.completedAt = dto.completedAt
					? new Date(dto.completedAt)
					: null;
			}
			if (dto.notes !== undefined) row.notes = dto.notes ?? null;

			const nowCompleted = row.status === TransferStatus.COMPLETED;
			if (nowCompleted && !wasCompleted) {
				for (const line of row.items ?? []) {
					const productId = line.product?.id;
					if (!productId) continue;
					await this.productsService.decreaseStock(
						productId,
						Number.parseFloat(line.quantity),
						em,
					);
				}
			}

			await em.save(row);

			return em.findOneOrFail(InventoryTransfer, {
				where: { id },
				relations: {
					transferredBy: true,
					receivedBy: true,
					items: { product: true },
				},
			});
		});
	}

	async complete(id: number): Promise<InventoryTransfer> {
		return this.update(id, {
			status: TransferStatus.COMPLETED,
			completedAt: new Date().toISOString(),
		});
	}

	async cancel(id: number): Promise<InventoryTransfer> {
		return this.update(id, { status: TransferStatus.CANCELLED });
	}
}
