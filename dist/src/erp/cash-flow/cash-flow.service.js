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
exports.CashFlowService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../entities/payment.entity");
const cash_handover_entity_1 = require("../entities/cash-handover.entity");
const invoice_entity_1 = require("../entities/invoice.entity");
const cash_handover_status_enum_1 = require("../enums/cash-handover-status.enum");
let CashFlowService = class CashFlowService {
    constructor(payments, handovers, invoices) {
        this.payments = payments;
        this.handovers = handovers;
        this.invoices = invoices;
    }
    async buildLedger(userId) {
        const [payments, handoverRows, invoiceCash] = await Promise.all([
            this.payments.find({
                where: { receivedBy: { id: userId } },
                relations: { receivedBy: true },
            }),
            this.handovers.find({
                where: {
                    handedBy: { id: userId },
                    fromType: "vehicle",
                    status: (0, typeorm_2.In)([
                        cash_handover_status_enum_1.CashHandoverStatus.PENDING,
                        cash_handover_status_enum_1.CashHandoverStatus.CONFIRMED,
                    ]),
                },
            }),
            this.invoices
                .createQueryBuilder("inv")
                .where("inv.sales_rep_id = :userId", { userId })
                .andWhere("CAST(inv.paid_amount AS DECIMAL) > 0")
                .getMany(),
        ]);
        const ledger = {};
        const addReceipt = (currency, origAmt, usdAmt) => {
            const cur = currency || "USD";
            if (!ledger[cur]) {
                ledger[cur] = {
                    recv_orig: 0,
                    recv_usd: 0,
                    handed_orig: 0,
                    handed_usd: 0,
                };
            }
            ledger[cur].recv_orig += origAmt;
            ledger[cur].recv_usd += usdAmt;
        };
        for (const p of payments) {
            addReceipt(p.currency, parseFloat(p.amount || "0"), parseFloat(p.amountUsd || p.amount || "0"));
        }
        for (const inv of invoiceCash) {
            const cur = inv.currency || "USD";
            const orig = parseFloat(inv.paidAmount || "0");
            const rate = parseFloat(inv.exchangeRate || "1");
            addReceipt(cur, orig, cur === "USD" ? orig : orig / rate);
        }
        for (const h of handoverRows) {
            const cur = h.originalCurrency || "USD";
            const origAmt = parseFloat(h.originalAmount || h.amount || "0");
            const handedUsd = parseFloat(h.amount || "0");
            if (!ledger[cur]) {
                ledger[cur] = {
                    recv_orig: 0,
                    recv_usd: 0,
                    handed_orig: 0,
                    handed_usd: 0,
                };
            }
            ledger[cur].handed_orig += origAmt;
            ledger[cur].handed_usd += handedUsd;
        }
        return ledger;
    }
    async getMyCashFlow(userId) {
        const ledger = await this.buildLedger(userId);
        const breakdown = {};
        let totalReceivedUsd = 0;
        let totalHandedUsd = 0;
        let totalBalanceUsd = 0;
        for (const [cur, v] of Object.entries(ledger)) {
            const balance_orig = v.recv_orig - v.handed_orig;
            const balance_usd = v.recv_usd - v.handed_usd;
            const weighted_rate = balance_usd > 0.001 ? balance_orig / balance_usd : null;
            breakdown[cur] = {
                received_orig: v.recv_orig,
                received_usd: v.recv_usd,
                handed_orig: v.handed_orig,
                handed_usd: v.handed_usd,
                balance_orig,
                balance_usd,
                weighted_rate,
            };
            totalReceivedUsd += v.recv_usd;
            totalHandedUsd += v.handed_usd;
            totalBalanceUsd += balance_usd;
        }
        return {
            user_id: userId,
            breakdown,
            totals: {
                received_usd: totalReceivedUsd,
                handed_usd: totalHandedUsd,
                balance_usd: totalBalanceUsd,
            },
        };
    }
    async validateHandover(userId, body) {
        const ledger = await this.buildLedger(userId);
        const cur = (body.currency || "USD").toUpperCase();
        const requested = parseFloat(String(body.amount ?? 0));
        const row = ledger[cur] || {
            recv_orig: 0,
            recv_usd: 0,
            handed_orig: 0,
            handed_usd: 0,
        };
        const availableUsd = row.recv_usd - row.handed_usd;
        const ok = requested <= availableUsd + 0.01;
        return {
            valid: ok,
            currency: cur,
            requested_usd: requested,
            available_usd: availableUsd,
            message: ok
                ? "المبلغ متاح للتسليم"
                : "المبلغ يتجاوز الرصيد المتاح",
        };
    }
};
exports.CashFlowService = CashFlowService;
exports.CashFlowService = CashFlowService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(cash_handover_entity_1.CashHandover)),
    __param(2, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CashFlowService);
//# sourceMappingURL=cash-flow.service.js.map