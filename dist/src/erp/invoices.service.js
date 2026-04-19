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
exports.ErpInvoicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("./entities/invoice.entity");
const invoice_item_entity_1 = require("./entities/invoice-item.entity");
const sequence_service_1 = require("./sequence.service");
const trade_currency_enum_1 = require("./enums/trade-currency.enum");
const invoice_payment_status_enum_1 = require("./enums/invoice-payment-status.enum");
function dec2(n) {
    return n.toFixed(2);
}
let ErpInvoicesService = class ErpInvoicesService {
    constructor(invoices, dataSource, sequences) {
        this.invoices = invoices;
        this.dataSource = dataSource;
        this.sequences = sequences;
    }
    findAll() {
        return this.invoices.find({
            order: { id: "DESC" },
            relations: {
                customer: true,
                salesRep: true,
                trip: true,
                items: { product: true },
            },
        });
    }
    async findOne(id) {
        const row = await this.invoices.findOne({
            where: { id },
            relations: {
                customer: true,
                salesRep: true,
                trip: true,
                items: { product: true },
            },
        });
        if (!row)
            throw new common_1.NotFoundException(`Invoice ${id} not found`);
        return row;
    }
    async create(dto) {
        const currency = dto.currency ?? trade_currency_enum_1.TradeCurrency.USD;
        const exchangeRate = dto.exchangeRate ?? 1;
        const discount = dto.discount ?? 0;
        const taxRate = dto.taxRate ?? 0;
        let subtotal = 0;
        for (const line of dto.items) {
            subtotal += line.quantity * line.unitPrice;
        }
        const subAfter = Math.max(subtotal - discount, 0);
        const taxAmount = subAfter * (taxRate / 100);
        const totalAmount = subAfter + taxAmount;
        return this.dataSource.transaction(async (em) => {
            const invoiceNumber = await this.sequences.next("INV");
            const inv = em.create(invoice_entity_1.Invoice, {
                invoiceNumber,
                customer: { id: dto.customerId },
                salesRep: { id: dto.salesRepId },
                date: new Date(dto.date),
                subtotal: dec2(subtotal),
                discount: dec2(discount),
                taxRate: dec2(taxRate),
                taxAmount: dec2(taxAmount),
                totalAmount: dec2(totalAmount),
                paidAmount: "0",
                currency,
                exchangeRate: dec2(exchangeRate),
                paymentStatus: invoice_payment_status_enum_1.InvoicePaymentStatus.PENDING,
                notes: dto.notes ?? null,
                trip: dto.tripId ? { id: dto.tripId } : undefined,
                editedOnce: false,
                lastEditAllowedUntil: null,
                synced: false,
            });
            await em.save(inv);
            for (const line of dto.items) {
                const lineTotal = line.quantity * line.unitPrice;
                const item = em.create(invoice_item_entity_1.InvoiceItem, {
                    invoice: { id: inv.id },
                    product: { id: line.productId },
                    quantity: dec2(line.quantity),
                    unitPrice: dec2(line.unitPrice),
                    total: dec2(lineTotal),
                });
                await em.save(item);
            }
            return em.findOneOrFail(invoice_entity_1.Invoice, {
                where: { id: inv.id },
                relations: {
                    customer: true,
                    salesRep: true,
                    trip: true,
                    items: { product: true },
                },
            });
        });
    }
};
exports.ErpInvoicesService = ErpInvoicesService;
exports.ErpInvoicesService = ErpInvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        sequence_service_1.SequenceService])
], ErpInvoicesService);
//# sourceMappingURL=invoices.service.js.map