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
exports.CentersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const centers_service_1 = require("./centers.service");
const create_center_dto_1 = require("./dto/create-center.dto");
const update_center_dto_1 = require("./dto/update-center.dto");
const create_sub_center_request_dto_1 = require("./dto/create-sub-center-request.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const center_type_enum_1 = require("./enums/center-type.enum");
let CentersController = class CentersController {
    constructor(centersService) {
        this.centersService = centersService;
    }
    findAll(centerType, activeRaw) {
        let active;
        if (activeRaw === "true")
            active = true;
        else if (activeRaw === "false")
            active = false;
        return this.centersService.findAll({ centerType, active });
    }
    create(dto) {
        return this.centersService.create(dto);
    }
    createSubCenterRequest(req, dto) {
        return this.centersService.createSubCenterRequest(req.user.userId, dto);
    }
    createQuickBranch(req, dto) {
        return this.centersService.createQuickBranch(req.user.userId, dto);
    }
    findOne(id) {
        return this.centersService.findOne(id);
    }
    update(id, dto) {
        return this.centersService.update(id, dto);
    }
};
exports.CentersController = CentersController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "List centers (legacy centersController.getCenters)" }),
    (0, swagger_1.ApiQuery)({ name: "center_type", enum: center_type_enum_1.CenterType, required: false }),
    (0, swagger_1.ApiQuery)({ name: "active", type: Boolean, required: false }),
    openapi.ApiResponse({ status: 200, type: [require("./entities/center.entity").Center] }),
    __param(0, (0, common_1.Query)("center_type")),
    __param(1, (0, common_1.Query)("active")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CentersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Create center" }),
    openapi.ApiResponse({ status: 201, type: require("./entities/center.entity").Center }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_center_dto_1.CreateCenterDto]),
    __metadata("design:returntype", void 0)
], CentersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("sub-center-requests"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: "Submit a request to add a sub-center / branch (stored for admin review)",
    }),
    openapi.ApiResponse({ status: 201, type: require("./entities/sub-center-request.entity").SubCenterRequest }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_sub_center_request_dto_1.CreateSubCenterRequestDto]),
    __metadata("design:returntype", void 0)
], CentersController.prototype, "createSubCenterRequest", null);
__decorate([
    (0, common_1.Post)("quick-branch"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: "Create a branch center from the quick form (auto code; parent = user center when set)",
    }),
    openapi.ApiResponse({ status: 201, type: require("./entities/center.entity").Center }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_sub_center_request_dto_1.CreateSubCenterRequestDto]),
    __metadata("design:returntype", void 0)
], CentersController.prototype, "createQuickBranch", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: "Get center by id" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/center.entity").Center }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CentersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Update center" }),
    openapi.ApiResponse({ status: 200, type: require("./entities/center.entity").Center }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_center_dto_1.UpdateCenterDto]),
    __metadata("design:returntype", void 0)
], CentersController.prototype, "update", null);
exports.CentersController = CentersController = __decorate([
    (0, swagger_1.ApiTags)("Centers"),
    (0, common_1.Controller)("centers"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [centers_service_1.CentersService])
], CentersController);
//# sourceMappingURL=centers.controller.js.map