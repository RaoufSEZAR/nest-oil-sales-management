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
exports.ErpPaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const sequence_service_1 = require("./sequence.service");
const trade_currency_enum_1 = require("./enums/trade-currency.enum");
function dec4(n) {
    return n.toFixed(4);
}
let ErpPaymentsService = class ErpPaymentsService {
    constructor(repo, sequences) {
        this.repo = repo;
        this.sequences = sequences;
    }
    findAll(filters) {
        const where = {};
        if (filters?.customer_id)
            where.customer = { id: filters.customer_id };
        if (filters?.received_by)
            where.receivedBy = { id: filters.received_by };
        if (filters?.from_date && filters?.to_date) {
            where.paymentDate = (0, typeorm_2.Between)(new Date(filters.from_date), new Date(filters.to_date));
        }
        return this.repo.find({
            where,
            order: { id: "DESC" },
            relations: { customer: true, receivedBy: true },
        });
    }
    findByCustomer(customerId) {
        return this.repo.find({
            where: { customer: { id: customerId } },
            order: { paymentDate: "DESC" },
            relations: { customer: true, receivedBy: true },
        });
    }
    async findOne(id) {
        const row = await this.repo.findOne({
            where: { id },
            relations: { customer: true, receivedBy: true },
        });
        if (!row)
            throw new common_1.NotFoundException(`Payment ${id} not found`);
        return row;
    }
    async create(dto) {
        const currency = dto.currency ?? trade_currency_enum_1.TradeCurrency.USD;
        const exchangeRate = dto.exchangeRate ?? 1;
        const amountUsd = dto.amount * exchangeRate;
        const paymentNumber = await this.sequences.next("PAY");
        const entity = this.repo.create({
            paymentNumber,
            customer: { id: dto.customerId },
            amount: dec4(dto.amount),
            currency,
            exchangeRate: dec4(exchangeRate),
            amountUsd: dec4(amountUsd),
            paymentMethod: dto.paymentMethod ?? "نقدي",
            paymentDate: new Date(dto.paymentDate),
            receivedBy: { id: dto.receivedById },
            referenceNumber: dto.referenceNumber ?? null,
            notes: dto.notes ?? null,
            relatedInvoices: dto.relatedInvoices ?? null,
            editedOnce: false,
            lastEditAllowedUntil: null,
        });
        return this.repo.save(entity);
    }
    async update(id, dto) {
        const row = await this.findOne(id);
        if (dto.amount !== undefined)
            row.amount = dec4(dto.amount);
        if (dto.currency !== undefined)
            row.currency = dto.currency;
        if (dto.exchangeRate !== undefined)
            row.exchangeRate = dec4(dto.exchangeRate);
        if (dto.paymentMethod !== undefined)
            row.paymentMethod = dto.paymentMethod;
        if (dto.paymentDate !== undefined)
            row.paymentDate = new Date(dto.paymentDate);
        if (dto.referenceNumber !== undefined)
            row.referenceNumber = dto.referenceNumber ?? null;
        if (dto.notes !== undefined)
            row.notes = dto.notes ?? null;
        if (dto.amount !== undefined || dto.exchangeRate !== undefined) {
            const amount = parseFloat(row.amount);
            const rate = parseFloat(row.exchangeRate);
            row.amountUsd = dec4(amount * rate);
        }
        return this.repo.save(row);
    }
    async remove(id) {
        await this.findOne(id);
        await this.repo.delete(id);
    }
};
exports.ErpPaymentsService = ErpPaymentsService;
exports.ErpPaymentsService = ErpPaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sequence_service_1.SequenceService])
], ErpPaymentsService);
//# sourceMappingURL=payments.service.js.map