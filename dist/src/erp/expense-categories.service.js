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
var ErpExpenseCategoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpExpenseCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_category_entity_1 = require("./entities/expense-category.entity");
const expense_entity_1 = require("./entities/expense.entity");
const DEFAULT_CATEGORIES = [
    "رواتب",
    "إيجار",
    "وقود",
    "صيانة",
    "دفعة مورد",
    "متنوع",
];
let ErpExpenseCategoriesService = ErpExpenseCategoriesService_1 = class ErpExpenseCategoriesService {
    constructor(categories, expenses) {
        this.categories = categories;
        this.expenses = expenses;
        this.logger = new common_1.Logger(ErpExpenseCategoriesService_1.name);
    }
    async onApplicationBootstrap() {
        try {
            const count = await this.categories.count();
            if (count > 0)
                return;
            for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
                await this.categories.save(this.categories.create({
                    name: DEFAULT_CATEGORIES[i],
                    sortOrder: i,
                    active: true,
                }));
            }
            this.logger.log(`Seeded ${DEFAULT_CATEGORIES.length} default expense categories`);
        }
        catch (err) {
            this.logger.error("Could not seed expense categories (tables may be missing). Redeploy after DB is ready.", err instanceof Error ? err.stack : String(err));
        }
    }
    findAll(includeInactive = false) {
        return this.categories.find({
            where: includeInactive ? {} : { active: true },
            order: { sortOrder: "ASC", name: "ASC" },
        });
    }
    findAllForAdmin() {
        return this.categories.find({
            order: { sortOrder: "ASC", name: "ASC" },
        });
    }
    getActiveNames() {
        return this.findAll(false).then((rows) => rows.map((r) => r.name));
    }
    async findOne(id) {
        const row = await this.categories.findOne({ where: { id } });
        if (!row)
            throw new common_1.NotFoundException(`Expense category ${id} not found`);
        return row;
    }
    async create(dto) {
        const name = dto.name.trim();
        const existing = await this.categories.findOne({ where: { name } });
        if (existing) {
            throw new common_1.ConflictException(`Category "${name}" already exists`);
        }
        const entity = this.categories.create({
            name,
            description: dto.description?.trim() || null,
            sortOrder: dto.sortOrder ?? 0,
            active: dto.active ?? true,
        });
        return this.categories.save(entity);
    }
    async update(id, dto) {
        const row = await this.findOne(id);
        const prevName = row.name;
        if (dto.name !== undefined) {
            const name = dto.name.trim();
            if (name !== row.name) {
                const dup = await this.categories.findOne({ where: { name } });
                if (dup && dup.id !== id) {
                    throw new common_1.ConflictException(`Category "${name}" already exists`);
                }
                row.name = name;
            }
        }
        if (dto.description !== undefined) {
            row.description = dto.description?.trim() || null;
        }
        if (dto.sortOrder !== undefined)
            row.sortOrder = dto.sortOrder;
        if (dto.active !== undefined)
            row.active = dto.active;
        const saved = await this.categories.save(row);
        if (dto.name !== undefined && prevName !== saved.name) {
            await this.expenses.update({ category: prevName }, { category: saved.name });
        }
        return saved;
    }
    async remove(id) {
        const row = await this.findOne(id);
        const inUse = await this.expenses.count({
            where: { category: row.name },
        });
        if (inUse > 0) {
            throw new common_1.ConflictException(`Cannot delete category "${row.name}" — used by ${inUse} expense(s)`);
        }
        await this.categories.delete(id);
    }
};
exports.ErpExpenseCategoriesService = ErpExpenseCategoriesService;
exports.ErpExpenseCategoriesService = ErpExpenseCategoriesService = ErpExpenseCategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_category_entity_1.ExpenseCategory)),
    __param(1, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ErpExpenseCategoriesService);
//# sourceMappingURL=expense-categories.service.js.map