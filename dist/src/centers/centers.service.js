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
exports.CentersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const center_entity_1 = require("./entities/center.entity");
const sub_center_request_entity_1 = require("./entities/sub-center-request.entity");
const user_entity_1 = require("../users/entities/user.entity");
const center_type_enum_1 = require("./enums/center-type.enum");
const sub_center_request_status_enum_1 = require("./enums/sub-center-request-status.enum");
const user_role_enum_1 = require("../users/enums/user-role.enum");
let CentersService = class CentersService {
    constructor(centersRepo, subCenterRequestsRepo, usersRepo) {
        this.centersRepo = centersRepo;
        this.subCenterRequestsRepo = subCenterRequestsRepo;
        this.usersRepo = usersRepo;
    }
    stripPasswordsFromUsers(center) {
        if (!center.users?.length)
            return;
        for (const u of center.users) {
            delete u.password;
        }
    }
    stripManagerPassword(center) {
        if (center.manager) {
            delete center.manager.password;
        }
    }
    async findAll(filters) {
        const qb = this.centersRepo
            .createQueryBuilder("c")
            .leftJoinAndSelect("c.manager", "manager")
            .leftJoinAndSelect("c.parentCenter", "parent")
            .leftJoinAndSelect("c.branches", "branches")
            .leftJoinAndSelect("c.vehicles", "vehicles")
            .orderBy("c.centerType", "ASC")
            .addOrderBy("c.name", "ASC");
        if (filters.centerType) {
            qb.andWhere("c.centerType = :centerType", {
                centerType: filters.centerType,
            });
        }
        if (filters.active !== undefined) {
            qb.andWhere("c.active = :active", { active: filters.active });
        }
        const rows = await qb.getMany();
        for (const c of rows) {
            this.stripManagerPassword(c);
        }
        return rows;
    }
    async findOne(id) {
        const center = await this.centersRepo.findOne({
            where: { id },
            relations: {
                manager: true,
                parentCenter: true,
                branches: true,
                vehicles: true,
                users: true,
            },
        });
        if (!center) {
            throw new common_1.NotFoundException("Center not found");
        }
        this.stripManagerPassword(center);
        this.stripPasswordsFromUsers(center);
        return center;
    }
    async createSubCenterRequest(userId, dto) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        const row = this.subCenterRequestsRepo.create({
            requestedName: dto.centerName.trim(),
            location: dto.location?.trim() || null,
            notes: dto.notes?.trim() || null,
            requestedByUserId: userId,
            requestedFromCenterId: user.centerId ?? null,
            status: sub_center_request_status_enum_1.SubCenterRequestStatus.PENDING,
        });
        return this.subCenterRequestsRepo.save(row);
    }
    async allocateUniqueBranchCode(nameSeed) {
        const slug = nameSeed
            .replace(/[^a-zA-Z0-9]/g, "")
            .toUpperCase()
            .slice(0, 6);
        const prefix = (slug.length ? slug : "BR").slice(0, 6);
        for (let attempt = 0; attempt < 40; attempt++) {
            const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
            const ts = Date.now().toString(36).toUpperCase().slice(-3);
            const candidate = `${prefix}-${ts}${rand}`.slice(0, 20);
            const exists = await this.centersRepo.exist({
                where: { code: candidate },
            });
            if (!exists)
                return candidate;
        }
        throw new common_1.ConflictException("Could not allocate a unique center code");
    }
    async createQuickBranch(userId, dto) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        if (user.role === user_role_enum_1.UserRole.MANAGER) {
            if (user.centerId == null) {
                throw new common_1.BadRequestException("Manager must be assigned to a center to add a branch");
            }
        }
        else if (user.role !== user_role_enum_1.UserRole.ADMIN &&
            user.role !== user_role_enum_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException("Not allowed to create a branch");
        }
        const name = dto.centerName.trim();
        if (!name.length) {
            throw new common_1.BadRequestException("Center name is required");
        }
        let parentCenterId = null;
        if (user.role === user_role_enum_1.UserRole.MANAGER) {
            parentCenterId = user.centerId;
        }
        else {
            parentCenterId = user.centerId ?? null;
        }
        const addressParts = [dto.location?.trim(), dto.notes?.trim()].filter((s) => !!s && s.length > 0);
        const address = addressParts.length ? addressParts.join("\n\n") : null;
        const code = await this.allocateUniqueBranchCode(name);
        return this.create({
            name,
            code,
            centerType: center_type_enum_1.CenterType.BRANCH,
            isIndependent: false,
            address: address ?? undefined,
            parentCenterId: parentCenterId ?? undefined,
        });
    }
    async create(dto) {
        const dup = await this.centersRepo.findOne({
            where: { code: dto.code },
        });
        if (dup) {
            throw new common_1.ConflictException("Center code already exists");
        }
        if (dto.managerId) {
            const mgr = await this.usersRepo.findOne({
                where: { id: dto.managerId },
            });
            if (!mgr) {
                throw new common_1.BadRequestException("Manager user not found");
            }
        }
        if (dto.parentCenterId != null) {
            const parent = await this.centersRepo.findOne({
                where: { id: dto.parentCenterId },
            });
            if (!parent) {
                throw new common_1.BadRequestException("Parent center not found");
            }
        }
        const center = this.centersRepo.create({
            name: dto.name,
            code: dto.code,
            centerType: dto.centerType ?? center_type_enum_1.CenterType.BRANCH,
            isIndependent: dto.isIndependent ?? false,
            address: dto.address ?? null,
            managerId: dto.managerId ?? null,
            parentCenterId: dto.parentCenterId ?? null,
            active: true,
        });
        return this.centersRepo.save(center);
    }
    async update(id, dto) {
        const center = await this.centersRepo.findOne({ where: { id } });
        if (!center) {
            throw new common_1.NotFoundException("Center not found");
        }
        if (dto.code && dto.code !== center.code) {
            const dup = await this.centersRepo.findOne({
                where: { code: dto.code },
            });
            if (dup) {
                throw new common_1.ConflictException("Center code already exists");
            }
        }
        if (dto.managerId) {
            const mgr = await this.usersRepo.findOne({
                where: { id: dto.managerId },
            });
            if (!mgr) {
                throw new common_1.BadRequestException("Manager user not found");
            }
        }
        if (dto.parentCenterId !== undefined && dto.parentCenterId !== null) {
            if (dto.parentCenterId === id) {
                throw new common_1.BadRequestException("Center cannot be its own parent");
            }
            const parent = await this.centersRepo.findOne({
                where: { id: dto.parentCenterId },
            });
            if (!parent) {
                throw new common_1.BadRequestException("Parent center not found");
            }
        }
        Object.assign(center, {
            ...(dto.name !== undefined && { name: dto.name }),
            ...(dto.code !== undefined && { code: dto.code }),
            ...(dto.centerType !== undefined && { centerType: dto.centerType }),
            ...(dto.isIndependent !== undefined && {
                isIndependent: dto.isIndependent,
            }),
            ...(dto.address !== undefined && { address: dto.address }),
            ...(dto.managerId !== undefined && { managerId: dto.managerId }),
            ...(dto.parentCenterId !== undefined && {
                parentCenterId: dto.parentCenterId,
            }),
            ...(dto.active !== undefined && { active: dto.active }),
        });
        return this.centersRepo.save(center);
    }
};
exports.CentersService = CentersService;
exports.CentersService = CentersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(center_entity_1.Center)),
    __param(1, (0, typeorm_1.InjectRepository)(sub_center_request_entity_1.SubCenterRequest)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CentersService);
//# sourceMappingURL=centers.service.js.map