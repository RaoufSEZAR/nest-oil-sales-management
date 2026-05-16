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
exports.ErpExpensesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const expenses_service_1 = require("./expenses.service");
const documents_dto_1 = require("./dto/documents.dto");
const api_tags_1 = require("../swagger/api-tags");
let ErpExpensesController = class ErpExpensesController {
    constructor(expenses) {
        this.expenses = expenses;
    }
    getCategories() {
        return this.expenses.getCategories();
    }
    findAll(category, center_id, from_date, to_date) {
        return this.expenses.findAll({
            category,
            center_id: center_id ? parseInt(center_id, 10) : undefined,
            from_date,
            to_date,
        });
    }
    findOne(id) {
        return this.expenses.findOne(id);
    }
    create(dto) {
        return this.expenses.create(dto);
    }
    remove(id) {
        return this.expenses.remove(id);
    }
};
exports.ErpExpensesController = ErpExpensesController;
__decorate([
    (0, common_1.Get)("categories"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Expense categories (legacy GET /expenses/categories)" }),
    openapi.ApiResponse({ status: 200, type: [String] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ErpExpensesController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "List expenses" }),
    (0, swagger_1.ApiQuery)({ name: "category", required: false }),
    (0, swagger_1.ApiQuery)({ name: "center_id", required: false }),
    (0, swagger_1.ApiQuery)({ name: "from_date", required: false }),
    (0, swagger_1.ApiQuery)({ name: "to_date", required: false }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/expense.entity").Expense] }),
    __param(0, (0, common_1.Query)("category")),
    __param(1, (0, common_1.Query)("center_id")),
    __param(2, (0, common_1.Query)("from_date")),
    __param(3, (0, common_1.Query)("to_date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ErpExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get expense by id" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/expense.entity").Expense }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpExpensesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Create expense" }),
    openapi.ApiResponse({ status: 201, type: require("./entities/expense.entity").Expense }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [documents_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", void 0)
], ErpExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Delete expense" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpExpensesController.prototype, "remove", null);
exports.ErpExpensesController = ErpExpensesController = __decorate([
    (0, swagger_1.ApiTags)(api_tags_1.SwaggerTags.ErpExpenses),
    (0, common_1.Controller)("expenses"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [expenses_service_1.ErpExpensesService])
], ErpExpensesController);
//# sourceMappingURL=expenses.controller.js.map