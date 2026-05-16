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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const center_entity_1 = require("../centers/entities/center.entity");
const user_entity_1 = require("../users/entities/user.entity");
const vehicle_trip_entity_1 = require("../erp/entities/vehicle-trip.entity");
const RECENT_TRIPS_LIMIT = 10;
let VehiclesService = class VehiclesService {
    constructor(vehiclesRepo, centersRepo, usersRepo, tripsRepo) {
        this.vehiclesRepo = vehiclesRepo;
        this.centersRepo = centersRepo;
        this.usersRepo = usersRepo;
        this.tripsRepo = tripsRepo;
    }
    stripRepPassword(vehicle) {
        if (vehicle.currentSalesRep) {
            delete vehicle.currentSalesRep.password;
        }
    }
    async findAll(filters) {
        const qb = this.vehiclesRepo
            .createQueryBuilder("v")
            .leftJoinAndSelect("v.center", "center")
            .leftJoinAndSelect("v.currentSalesRep", "currentSalesRep")
            .orderBy("v.name", "ASC");
        if (filters.centerId !== undefined) {
            qb.andWhere("v.centerId = :centerId", { centerId: filters.centerId });
        }
        if (filters.active !== undefined) {
            qb.andWhere("v.active = :active", { active: filters.active });
        }
        const rows = await qb.getMany();
        for (const v of rows) {
            this.stripRepPassword(v);
        }
        return rows;
    }
    async findOne(id) {
        const vehicle = await this.vehiclesRepo.findOne({
            where: { id },
            relations: { center: true, currentSalesRep: true },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException("Vehicle not found");
        }
        vehicle.trips = await this.tripsRepo.find({
            where: { vehicle: { id } },
            order: { tripDate: "DESC" },
            take: RECENT_TRIPS_LIMIT,
        });
        this.stripRepPassword(vehicle);
        return vehicle;
    }
    async create(dto) {
        const center = await this.centersRepo.findOne({
            where: { id: dto.centerId },
        });
        if (!center) {
            throw new common_1.BadRequestException("Center not found");
        }
        const dup = await this.vehiclesRepo.findOne({ where: { code: dto.code } });
        if (dup) {
            throw new common_1.ConflictException("Vehicle code already exists");
        }
        if (dto.currentSalesRepId) {
            const rep = await this.usersRepo.findOne({
                where: { id: dto.currentSalesRepId },
            });
            if (!rep) {
                throw new common_1.BadRequestException("Sales rep user not found");
            }
        }
        const vehicle = this.vehiclesRepo.create({
            name: dto.name,
            code: dto.code,
            licensePlate: dto.licensePlate ?? null,
            centerId: dto.centerId,
            currentSalesRepId: dto.currentSalesRepId ?? null,
            vehicleType: dto.vehicleType ?? null,
            active: true,
        });
        const saved = await this.vehiclesRepo.save(vehicle);
        return this.findOne(saved.id);
    }
    async update(id, dto) {
        const vehicle = await this.vehiclesRepo.findOne({ where: { id } });
        if (!vehicle) {
            throw new common_1.NotFoundException("Vehicle not found");
        }
        if (dto.code && dto.code !== vehicle.code) {
            const dup = await this.vehiclesRepo.findOne({
                where: { code: dto.code },
            });
            if (dup) {
                throw new common_1.ConflictException("Vehicle code already exists");
            }
        }
        if (dto.centerId != null) {
            const center = await this.centersRepo.findOne({
                where: { id: dto.centerId },
            });
            if (!center) {
                throw new common_1.BadRequestException("Center not found");
            }
        }
        if (dto.currentSalesRepId) {
            const rep = await this.usersRepo.findOne({
                where: { id: dto.currentSalesRepId },
            });
            if (!rep) {
                throw new common_1.BadRequestException("Sales rep user not found");
            }
        }
        Object.assign(vehicle, {
            ...(dto.name !== undefined && { name: dto.name }),
            ...(dto.code !== undefined && { code: dto.code }),
            ...(dto.licensePlate !== undefined && {
                licensePlate: dto.licensePlate,
            }),
            ...(dto.centerId !== undefined && { centerId: dto.centerId }),
            ...(dto.currentSalesRepId !== undefined && {
                currentSalesRepId: dto.currentSalesRepId,
            }),
            ...(dto.vehicleType !== undefined && { vehicleType: dto.vehicleType }),
            ...(dto.active !== undefined && { active: dto.active }),
        });
        await this.vehiclesRepo.save(vehicle);
        return this.findOne(id);
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(center_entity_1.Center)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(vehicle_trip_entity_1.VehicleTrip)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map