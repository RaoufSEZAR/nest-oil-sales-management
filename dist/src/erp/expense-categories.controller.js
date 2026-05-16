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
exports.ErpExpenseCategoriesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const expense_categories_service_1 = require("./expense-categories.service");
const expense_category_dto_1 = require("./dto/expense-category.dto");
const api_tags_1 = require("../swagger/api-tags");
let ErpExpenseCategoriesController = class ErpExpenseCategoriesController {
    constructor(categories) {
        this.categories = categories;
    }
    findAll(all) {
        if (all === "1" || all === "true") {
            return this.categories.findAllForAdmin();
        }
        return this.categories.findAll(false);
    }
    findOne(id) {
        return this.categories.findOne(id);
    }
    create(dto) {
        return this.categories.create(dto);
    }
    update(id, dto) {
        return this.categories.update(id, dto);
    }
    remove(id) {
        return this.categories.remove(id);
    }
};
exports.ErpExpenseCategoriesController = ErpExpenseCategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "List expense categories" }),
    (0, swagger_1.ApiQuery)({ name: "all", required: false, description: "Include inactive" }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/expense-category.entity").ExpenseCategory] }),
    __param(0, (0, common_1.Query)("all")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ErpExpenseCategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get expense category by id" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/expense-category.entity").ExpenseCategory }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpExpenseCategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Create expense category" }),
    openapi.ApiResponse({ status: 201, type: require("./entities/expense-category.entity").ExpenseCategory }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [expense_category_dto_1.CreateExpenseCategoryDto]),
    __metadata("design:returntype", void 0)
], ErpExpenseCategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Update expense category" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/expense-category.entity").ExpenseCategory }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, expense_category_dto_1.UpdateExpenseCategoryDto]),
    __metadata("design:returntype", void 0)
], ErpExpenseCategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Delete expense category" }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ErpExpenseCategoriesController.prototype, "remove", null);
exports.ErpExpenseCategoriesController = ErpExpenseCategoriesController = __decorate([
    (0, swagger_1.ApiTags)(api_tags_1.SwaggerTags.ErpExpenses),
    (0, common_1.Controller)("expense-categories"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [expense_categories_service_1.ErpExpenseCategoriesService])
], ErpExpenseCategoriesController);
//# sourceMappingURL=expense-categories.controller.js.map