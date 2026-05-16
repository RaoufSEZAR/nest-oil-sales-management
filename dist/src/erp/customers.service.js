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
exports.ErpCustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./entities/customer.entity");
let ErpCustomersService = class ErpCustomersService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll(filters) {
        const where = {};
        if (filters?.sales_rep_id)
            where.salesRep = { id: filters.sales_rep_id };
        if (filters?.area)
            where.area = filters.area;
        if (filters?.search) {
            where.name = (0, typeorm_2.Like)(`%${filters.search}%`);
        }
        return this.repo.find({
            where,
            order: { id: "DESC" },
            relations: { salesRep: true },
        });
    }
    async getBalance(id) {
        const customer = await this.findOne(id);
        return {
            customer_id: customer.id,
            balance: parseFloat(customer.balance || "0"),
            deferred_payment: parseFloat(customer.deferredPayment || "0"),
        };
    }
    async remove(id) {
        await this.findOne(id);
        await this.repo.delete(id);
    }
    async findOne(id) {
        const row = await this.repo.findOne({
            where: { id },
            relations: { salesRep: true },
        });
        if (!row)
            throw new common_1.NotFoundException(`Customer ${id} not found`);
        return row;
    }
    async create(dto) {
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
    async update(id, dto) {
        const row = await this.findOne(id);
        if (dto.name !== undefined)
            row.name = dto.name;
        if (dto.phone !== undefined)
            row.phone = dto.phone;
        if (dto.address !== undefined)
            row.address = dto.address ?? null;
        if (dto.area !== undefined)
            row.area = dto.area ?? null;
        if (dto.notes !== undefined)
            row.notes = dto.notes ?? null;
        if (dto.salesRepId !== undefined) {
            row.salesRep = dto.salesRepId
                ? { id: dto.salesRepId }
                : null;
        }
        return this.repo.save(row);
    }
};
exports.ErpCustomersService = ErpCustomersService;
exports.ErpCustomersService = ErpCustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ErpCustomersService);
//# sourceMappingURL=customers.service.js.map