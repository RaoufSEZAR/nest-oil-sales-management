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
exports.ErpReturnsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const query_filters_1 = require("../common/utils/query-filters");
const sales_return_status_enum_1 = require("./enums/sales-return-status.enum");
const sales_return_entity_1 = require("./entities/sales-return.entity");
const return_item_entity_1 = require("./entities/return-item.entity");
const sequence_service_1 = require("./sequence.service");
const return_item_condition_enum_1 = require("./enums/return-item-condition.enum");
const products_service_1 = require("../products/products.service");
function dec2(n) {
    return n.toFixed(2);
}
function toPgDate(iso) {
    return iso.slice(0, 10);
}
let ErpReturnsService = class ErpReturnsService {
    constructor(returns, dataSource, sequences, productsService) {
        this.returns = returns;
        this.dataSource = dataSource;
        this.sequences = sequences;
        this.productsService = productsService;
    }
    findAll(filters) {
        const where = {};
        if (filters?.customer_id)
            where.customer = { id: filters.customer_id };
        if (filters?.sales_rep_id)
            where.salesRep = { id: filters.sales_rep_id };
        if (filters?.return_type)
            where.returnType = filters.return_type;
        if (filters?.status)
            where.status = filters.status;
        const dateFilter = (0, query_filters_1.dateRangeWhere)(filters?.from_date, filters?.to_date);
        if (dateFilter)
            where.date = dateFilter;
        return this.returns.find({
            where,
            order: { id: "DESC" },
            relations: {
                customer: true,
                salesRep: true,
                originalInvoice: true,
                items: { product: true },
            },
        });
    }
    async findOne(id) {
        const row = await this.returns.findOne({
            where: { id },
            relations: {
                customer: true,
                salesRep: true,
                originalInvoice: true,
                items: { product: true },
            },
        });
        if (!row)
            throw new common_1.NotFoundException(`Return ${id} not found`);
        return row;
    }
    async create(dto) {
        let total = 0;
        for (const line of dto.items) {
            total += line.quantity * line.unitPrice;
        }
        return this.dataSource.transaction(async (em) => {
            const returnNumber = await this.sequences.next("RET");
            const ret = em.create(sales_return_entity_1.SalesReturn, {
                returnNumber,
                returnType: dto.returnType,
                originalInvoice: dto.originalInvoiceId
                    ? { id: dto.originalInvoiceId }
                    : undefined,
                customer: { id: dto.customerId },
                salesRep: { id: dto.salesRepId },
                date: toPgDate(dto.date),
                totalAmount: dec2(total),
                reason: dto.reason ?? null,
                notes: dto.notes ?? null,
                status: sales_return_status_enum_1.SalesReturnStatus.PENDING,
                synced: false,
            });
            await em.save(ret);
            for (const line of dto.items) {
                const lineTotal = line.quantity * line.unitPrice;
                const item = em.create(return_item_entity_1.ReturnItem, {
                    salesReturn: { id: ret.id },
                    product: { id: line.productId },
                    quantity: dec2(line.quantity),
                    unitPrice: dec2(line.unitPrice),
                    total: dec2(lineTotal),
                    condition: line.condition ?? return_item_condition_enum_1.ReturnItemCondition.GOOD,
                    reasonDetail: line.reasonDetail ?? null,
                });
                await em.save(item);
            }
            return em.findOneOrFail(sales_return_entity_1.SalesReturn, {
                where: { id: ret.id },
                relations: {
                    customer: true,
                    salesRep: true,
                    originalInvoice: true,
                    items: { product: true },
                },
            });
        });
    }
    async updateStatus(id, status, managerNotes) {
        if (!Object.values(sales_return_status_enum_1.SalesReturnStatus).includes(status)) {
            throw new common_1.BadRequestException("Invalid return status");
        }
        return this.dataSource.transaction(async (em) => {
            const row = await em.findOne(sales_return_entity_1.SalesReturn, {
                where: { id },
                relations: {
                    customer: true,
                    items: { product: true },
                },
            });
            if (!row)
                throw new common_1.NotFoundException(`Return ${id} not found`);
            if (row.status !== sales_return_status_enum_1.SalesReturnStatus.PENDING) {
                throw new common_1.BadRequestException("Return already processed");
            }
            if (status === sales_return_status_enum_1.SalesReturnStatus.APPROVED) {
                const customer = row.customer;
                customer.balance = (parseFloat(customer.balance || "0") +
                    parseFloat(row.totalAmount || "0")).toFixed(4);
                await em.save(customer);
                for (const line of row.items ?? []) {
                    const productId = line.product?.id;
                    if (!productId)
                        continue;
                    await this.productsService.increaseStock(productId, parseFloat(line.quantity), em);
                }
            }
            row.status = status;
            if (managerNotes !== undefined) {
                row.notes = [row.notes, managerNotes].filter(Boolean).join("\n");
            }
            await em.save(row);
            return em.findOneOrFail(sales_return_entity_1.SalesReturn, {
                where: { id },
                relations: {
                    customer: true,
                    salesRep: true,
                    originalInvoice: true,
                    items: { product: true },
                },
            });
        });
    }
    async getReport(filters) {
        const status = filters?.status ?? sales_return_status_enum_1.SalesReturnStatus.APPROVED;
        const rows = await this.findAll({
            status,
            from_date: filters?.from_date,
            to_date: filters?.to_date,
        });
        const byProduct = {};
        for (const ret of rows) {
            for (const line of ret.items ?? []) {
                const pid = line.product?.id;
                if (!pid)
                    continue;
                if (!byProduct[pid]) {
                    byProduct[pid] = {
                        product_id: pid,
                        name: line.product?.name ?? "",
                        total_qty: 0,
                        total_amount: 0,
                    };
                }
                byProduct[pid].total_qty += parseFloat(line.quantity);
                byProduct[pid].total_amount += parseFloat(line.total);
            }
        }
        const productReport = Object.values(byProduct);
        return {
            stats: {
                total_returns: rows.length,
                total_amount: rows.reduce((s, r) => s + parseFloat(r.totalAmount || "0"), 0),
                total_items: productReport.reduce((s, p) => s + p.total_qty, 0),
            },
            by_product: productReport,
            returns: rows.slice(0, 50),
        };
    }
};
exports.ErpReturnsService = ErpReturnsService;
exports.ErpReturnsService = ErpReturnsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sales_return_entity_1.SalesReturn)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        sequence_service_1.SequenceService,
        products_service_1.ProductsService])
], ErpReturnsService);
//# sourceMappingURL=returns.service.js.map