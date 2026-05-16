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
exports.ExchangesLegacyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const currency_exchanges_service_1 = require("../currency-exchanges.service");
const documents_dto_1 = require("../dto/documents.dto");
let ExchangesLegacyController = class ExchangesLegacyController {
    constructor(exchanges) {
        this.exchanges = exchanges;
    }
    findAll() {
        return this.exchanges.findAll();
    }
    findOne(id) {
        return this.exchanges.findOne(id);
    }
    create(dto) {
        return this.exchanges.create(dto);
    }
};
exports.ExchangesLegacyController = ExchangesLegacyController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    openapi.ApiResponse({ status: 200, type: [require("../entities/currency-exchange.entity").CurrencyExchange] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExchangesLegacyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(...user_role_enum_1.ERP_MANAGEMENT_ROLES),
    openapi.ApiResponse({ status: 200, type: require("../entities/currency-exchange.entity").CurrencyExchange }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExchangesLegacyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    openapi.ApiResponse({ status: 201, type: require("../entities/currency-exchange.entity").CurrencyExchange }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [documents_dto_1.CreateCurrencyExchangeDto]),
    __metadata("design:returntype", void 0)
], ExchangesLegacyController.prototype, "create", null);
exports.ExchangesLegacyController = ExchangesLegacyController = __decorate([
    (0, swagger_1.ApiTags)("Exchanges (legacy)"),
    (0, common_1.Controller)("exchanges"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [currency_exchanges_service_1.ErpCurrencyExchangesService])
], ExchangesLegacyController);
//# sourceMappingURL=exchanges-legacy.controller.js.map