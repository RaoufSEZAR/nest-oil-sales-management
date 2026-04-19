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
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }
    async findAll(page = 1, limit = 10) {
        const [data, total] = await this.usersRepository.findAndCount({
            select: [
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
                "createdAt",
                "updatedAt",
            ],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: "DESC" },
        });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: [
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
                "createdAt",
                "updatedAt",
            ],
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
                "password",
                "createdAt",
                "updatedAt",
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
    async update(id, updateUserDto) {
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
            if (!updateUserDto.oldPassword) {
                throw new common_1.BadRequestException("Old password is required when changing password");
            }
            const userWithPassword = await this.findOneWithPassword(id);
            const trimmedOldPassword = updateUserDto.oldPassword.trim();
            const isOldPasswordValid = await bcrypt.compare(trimmedOldPassword, userWithPassword.password);
            if (!isOldPasswordValid) {
                throw new common_1.UnauthorizedException("Old password is incorrect");
            }
            const trimmedNewPassword = updateUserDto.password.trim();
            updateUserDto.password = await bcrypt.hash(trimmedNewPassword, 10);
        }
        const { oldPassword, ...updateData } = updateUserDto;
        Object.assign(user, updateData);
        return this.usersRepository.save(user);
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map