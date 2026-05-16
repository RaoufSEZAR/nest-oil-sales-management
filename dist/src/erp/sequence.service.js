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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const SEED_MAP = {
    INV: { prefix: "INV", pad: 6 },
    PAY: { prefix: "PAY", pad: 6 },
    CH: { prefix: "CH", pad: 6 },
    RET: { prefix: "RET", pad: 6 },
    EXP: { prefix: "EXP", pad: 6 },
    TRIP: { prefix: "TRIP", pad: 6 },
    PO: { prefix: "PO", pad: 6 },
    EXG: { prefix: "EXG", pad: 6 },
    TRF: { prefix: "TRF", pad: 6 },
};
let SequenceService = class SequenceService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async next(seqType) {
        const key = seqType.toUpperCase();
        const seed = SEED_MAP[key];
        if (!seed) {
            throw new common_1.BadRequestException(`Unknown sequence type: ${seqType}`);
        }
        const rows = await this.dataSource.query(`INSERT INTO sequences (seq_type, prefix, pad_length, current_value, created_at, updated_at)
       VALUES ($1, $2, $3, 1, NOW(), NOW())
       ON CONFLICT (seq_type) DO UPDATE SET
         current_value = sequences.current_value + 1,
         updated_at = NOW()
       RETURNING current_value, prefix, pad_length`, [key, seed.prefix, seed.pad]);
        const row = rows[0];
        const n = Number(row.current_value);
        return `${row.prefix}-${String(n).padStart(Number(row.pad_length), "0")}`;
    }
};
exports.SequenceService = SequenceService;
exports.SequenceService = SequenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SequenceService);
//# sourceMappingURL=sequence.service.js.map