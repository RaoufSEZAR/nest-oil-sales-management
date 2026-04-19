import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "src/erp/entities/customer.entity";
import { User } from "src/users/entities/user.entity";
import { CreateCustomerDto, UpdateCustomerDto } from "src/erp/dto/customer.dto";

@Injectable()
export class ErpCustomersService {
	constructor(
		@InjectRepository(Customer)
		private readonly repo: Repository<Customer>,
	) {}

	findAll(): Promise<Customer[]> {
		return this.repo.find({
			order: { id: "DESC" },
			relations: { salesRep: true },
		});
	}

	async findOne(id: number): Promise<Customer> {
		const row = await this.repo.findOne({
			where: { id },
			relations: { salesRep: true },
		});
		if (!row) throw new NotFoundException(`Customer ${id} not found`);
		return row;
	}

	async create(dto: CreateCustomerDto): Promise<Customer> {
		const entity = this.repo.create({
			name: dto.name,
			phone: dto.phone,
			address: dto.address ?? null,
			area: dto.area ?? null,
			notes: dto.notes ?? null,
			salesRep: dto.salesRepId ? { id: dto.salesRepId } : undefined,
		});
		return this.repo.save(entity);
	}

	async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
		const row = await this.findOne(id);
		if (dto.name !== undefined) row.name = dto.name;
		if (dto.phone !== undefined) row.phone = dto.phone;
		if (dto.address !== undefined) row.address = dto.address ?? null;
		if (dto.area !== undefined) row.area = dto.area ?? null;
		if (dto.notes !== undefined) row.notes = dto.notes ?? null;
		if (dto.salesRepId !== undefined) {
			row.salesRep = dto.salesRepId
				? ({ id: dto.salesRepId } as User)
				: null;
		}
		return this.repo.save(row);
	}
}
