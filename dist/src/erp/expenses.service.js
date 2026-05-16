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
exports.ErpExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_entity_1 = require("./entities/expense.entity");
const sequence_service_1 = require("./sequence.service");
const trade_currency_enum_1 = require("./enums/trade-currency.enum");
function dec4(n) {
    return n.toFixed(4);
}
let ErpExpensesService = class ErpExpensesService {
    constructor(repo, sequences) {
        this.repo = repo;
        this.sequences = sequences;
    }
    findAll() {
        return this.repo.find({
            order: { id: "DESC" },
            relations: { center: true, paidBy: true },
        });
    }
    async findOne(id) {
        const row = await this.repo.findOne({
            where: { id },
            relations: { center: true, paidBy: true },
        });
        if (!row)
            throw new common_1.NotFoundException(`Expense ${id} not found`);
        return row;
    }
    async create(dto) {
        const currency = dto.currency ?? trade_currency_enum_1.TradeCurrency.USD;
        const exchangeRate = dto.exchangeRate ?? 1;
        const amountUsd = dto.amount * exchangeRate;
        const expenseNumber = await this.sequences.next("EXP");
        const entity = this.repo.create({
            expenseNumber,
            center: dto.centerId ? { id: dto.centerId } : undefined,
            category: dto.category,
            description: dto.description ?? null,
            amount: dec4(dto.amount),
            currency,
            exchangeRate: dec4(exchangeRate),
            amountUsd: dec4(amountUsd),
            date: dto.date.slice(0, 10),
            paidBy: { id: dto.paidById },
            notes: dto.notes ?? null,
        });
        return this.repo.save(entity);
    }
};
exports.ErpExpensesService = ErpExpensesService;
exports.ErpExpensesService = ErpExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sequence_service_1.SequenceService])
], ErpExpensesService);
//# sourceMappingURL=expenses.service.js.map