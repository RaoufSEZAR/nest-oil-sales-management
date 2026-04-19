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
exports.ErpCurrencyExchangesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const currency_exchange_entity_1 = require("./entities/currency-exchange.entity");
const sequence_service_1 = require("./sequence.service");
function dec4(n) {
    return n.toFixed(4);
}
let ErpCurrencyExchangesService = class ErpCurrencyExchangesService {
    constructor(repo, sequences) {
        this.repo = repo;
        this.sequences = sequences;
    }
    findAll() {
        return this.repo.find({
            order: { id: "DESC" },
            relations: { center: true, createdBy: true },
        });
    }
    async findOne(id) {
        const row = await this.repo.findOne({
            where: { id },
            relations: { center: true, createdBy: true },
        });
        if (!row)
            throw new common_1.NotFoundException(`Currency exchange ${id} not found`);
        return row;
    }
    async create(dto) {
        const exchangeNumber = await this.sequences.next("EXG");
        const entity = this.repo.create({
            exchangeNumber,
            center: { id: dto.centerId },
            fromCurrency: dto.fromCurrency,
            fromAmount: dec4(dto.fromAmount),
            fromAmountUsd: dec4(dto.fromAmountUsd),
            toCurrency: dto.toCurrency,
            toAmount: dec4(dto.toAmount),
            toAmountUsd: dec4(dto.toAmountUsd),
            exchangeRate: dec4(dto.exchangeRate),
            fromWeightedRate: dec4(dto.fromWeightedRate ?? 1),
            toWeightedRate: dec4(dto.toWeightedRate ?? 1),
            differenceUsd: dec4(dto.differenceUsd ?? 0),
            notes: dto.notes ?? null,
            createdBy: { id: dto.createdById },
        });
        return this.repo.save(entity);
    }
};
exports.ErpCurrencyExchangesService = ErpCurrencyExchangesService;
exports.ErpCurrencyExchangesService = ErpCurrencyExchangesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(currency_exchange_entity_1.CurrencyExchange)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sequence_service_1.SequenceService])
], ErpCurrencyExchangesService);
//# sourceMappingURL=currency-exchanges.service.js.map