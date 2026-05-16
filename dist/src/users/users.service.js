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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const vehicle_entity_1 = require("../vehicles/entities/vehicle.entity");
const center_entity_1 = require("../centers/entities/center.entity");
const bcrypt = require("bcrypt");
const USER_LIST_SELECT = [
    "id",
    "email",
    "firstName",
    "lastName",
    "role",
    "isActive",
    "phoneNumber",
    "address",
    "preferredLang",
    "region",
    "centerId",
    "vehicleId",
    "createdAt",
    "updatedAt",
];
let UsersService = class UsersService {
    constructor(usersRepository, vehiclesRepository, centersRepository, dataSource) {
        this.usersRepository = usersRepository;
        this.vehiclesRepository = vehiclesRepository;
        this.centersRepository = centersRepository;
        this.dataSource = dataSource;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.usersRepository.save(user);
    }
    async findAll(page = 1, limit = 10, filters) {
        const where = {};
        if (filters?.role)
            where.role = filters.role;
        if (filters?.centerId !== undefined)
            where.centerId = filters.centerId;
        if (filters?.active !== undefined)
            where.isActive = filters.active;
        const [data, total] = await this.usersRepository.findAndCount({
            select: [...USER_LIST_SELECT],
            where,
            relations: ["center", "vehicle"],
            skip: (page - 1) * limit,
            take: limit,
            order: { role: "ASC", firstName: "ASC", lastName: "ASC" },
        });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 0,
        };
    }
    async findByCenter(centerId) {
        return this.usersRepository.find({
            where: { centerId },
            select: [...USER_LIST_SELECT],
            relations: ["vehicle"],
            order: { role: "ASC", firstName: "ASC", lastName: "ASC" },
        });
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: [...USER_LIST_SELECT],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findOneWithRelations(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: [...USER_LIST_SELECT],
            relations: ["center", "vehicle"],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findOneWithPassword(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: [
                ...USER_LIST_SELECT,
                "password",
            ],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (!user.password) {
            throw new common_1.NotFoundException(`User password not found for user with ID ${id}`);
        }
        return user;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({
            where: { email },
        });
    }
    async update(id, updateUserDto, options) {
        const user = await this.findOne(id);
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException("User with this email already exists");
            }
        }
        if (updateUserDto.password) {
            const trimmedNewPassword = updateUserDto.password.trim();
            if (options?.allowStaffPasswordReset && !updateUserDto.oldPassword) {
                updateUserDto.password = await bcrypt.hash(trimmedNewPassword, 10);
            }
            else {
                if (!updateUserDto.oldPassword) {
                    throw new common_1.BadRequestException("Old password is required when changing password");
                }
                const userWithPassword = await this.findOneWithPassword(id);
                const trimmedOldPassword = updateUserDto.oldPassword.trim();
                const isOldPasswordValid = await bcrypt.compare(trimmedOldPassword, userWithPassword.password);
                if (!isOldPasswordValid) {
                    throw new common_1.UnauthorizedException("Old password is incorrect");
                }
                updateUserDto.password = await bcrypt.hash(trimmedNewPassword, 10);
            }
        }
        const { oldPassword, ...updateData } = updateUserDto;
        Object.assign(user, updateData);
        return this.usersRepository.save(user);
    }
    async resetPassword(id, password) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        user.password = await bcrypt.hash(password.trim(), 10);
        await this.usersRepository.save(user);
        return { message: "Password reset successfully" };
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
    async deactivate(id) {
        const user = await this.findOne(id);
        user.isActive = false;
        return this.usersRepository.save(user);
    }
    async activate(id) {
        const user = await this.findOne(id);
        user.isActive = true;
        return this.usersRepository.save(user);
    }
    async toggleActive(id) {
        const user = await this.findOne(id);
        user.isActive = !user.isActive;
        return this.usersRepository.save(user);
    }
    async assignToCenter(userId, centerId) {
        const [user, center] = await Promise.all([
            this.usersRepository.findOne({ where: { id: userId } }),
            this.centersRepository.findOne({ where: { id: centerId } }),
        ]);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        if (!center) {
            throw new common_1.NotFoundException(`Center with ID ${centerId} not found`);
        }
        user.centerId = centerId;
        await this.usersRepository.save(user);
        return this.findOneWithRelations(userId);
    }
    async assignToVehicle(userId, vehicleId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.findOne(user_entity_1.User, {
                where: { id: userId },
            });
            const vehicle = await queryRunner.manager.findOne(vehicle_entity_1.Vehicle, {
                where: { id: vehicleId },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${userId} not found`);
            }
            if (!vehicle) {
                throw new common_1.NotFoundException(`Vehicle with ID ${vehicleId} not found`);
            }
            user.vehicleId = vehicleId;
            user.centerId = vehicle.centerId;
            await queryRunner.manager.save(user_entity_1.User, user);
            vehicle.currentSalesRepId = userId;
            await queryRunner.manager.save(vehicle_entity_1.Vehicle, vehicle);
            await queryRunner.commitTransaction();
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        }
        finally {
            await queryRunner.release();
        }
        return this.findOneWithRelations(userId);
    }
    async unassign(userId, remove) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.findOne(user_entity_1.User, {
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${userId} not found`);
            }
            if (remove === "vehicle" || remove === "all") {
                if (user.vehicleId) {
                    await queryRunner.manager.update(vehicle_entity_1.Vehicle, { id: user.vehicleId, currentSalesRepId: userId }, { currentSalesRepId: null });
                }
                user.vehicleId = null;
            }
            if (remove === "center" || remove === "all") {
                user.centerId = null;
            }
            await queryRunner.manager.save(user_entity_1.User, user);
            await queryRunner.commitTransaction();
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        }
        finally {
            await queryRunner.release();
        }
        return this.findOneWithRelations(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(2, (0, typeorm_1.InjectRepository)(center_entity_1.Center)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], UsersService);
//# sourceMappingURL=users.service.js.map