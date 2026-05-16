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
exports.ErpVehicleTripsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_trip_entity_1 = require("./entities/vehicle-trip.entity");
const sequence_service_1 = require("./sequence.service");
const trip_status_enum_1 = require("./enums/trip-status.enum");
function dec2(n) {
    return n.toFixed(2);
}
let ErpVehicleTripsService = class ErpVehicleTripsService {
    constructor(repo, sequences) {
        this.repo = repo;
        this.sequences = sequences;
    }
    findAll(filters) {
        const where = {};
        if (filters?.vehicle_id)
            where.vehicle = { id: filters.vehicle_id };
        if (filters?.status)
            where.status = filters.status;
        return this.repo.find({
            where,
            order: { id: "DESC" },
            relations: { vehicle: true, salesRep: true },
        });
    }
    async findActiveByVehicle(vehicleId) {
        return this.repo.findOne({
            where: { vehicle: { id: vehicleId }, status: trip_status_enum_1.TripStatus.ACTIVE },
            relations: { vehicle: true, salesRep: true },
            order: { id: "DESC" },
        });
    }
    async findOne(id) {
        const row = await this.repo.findOne({
            where: { id },
            relations: { vehicle: true, salesRep: true },
        });
        if (!row)
            throw new common_1.NotFoundException(`Vehicle trip ${id} not found`);
        return row;
    }
    async create(dto) {
        const tripNumber = await this.sequences.next("TRIP");
        const entity = this.repo.create({
            tripNumber,
            vehicle: { id: dto.vehicleId },
            salesRep: { id: dto.salesRepId },
            tripDate: dto.tripDate.slice(0, 10),
            odometerStart: dto.odometerStart,
            odometerStartPhoto: dto.odometerStartPhoto ?? null,
            notes: dto.notes ?? null,
            status: trip_status_enum_1.TripStatus.ACTIVE,
            startedAt: new Date(),
            endedAt: null,
        });
        return this.repo.save(entity);
    }
    async update(id, dto) {
        const row = await this.findOne(id);
        if (dto.odometerEnd !== undefined)
            row.odometerEnd = dto.odometerEnd;
        if (dto.odometerEndPhoto !== undefined)
            row.odometerEndPhoto = dto.odometerEndPhoto ?? null;
        if (dto.fuelCompensation !== undefined)
            row.fuelCompensation = dec2(dto.fuelCompensation);
        if (dto.notes !== undefined)
            row.notes = dto.notes ?? null;
        if (dto.status !== undefined)
            row.status = dto.status;
        if (dto.endedAt !== undefined)
            row.endedAt = dto.endedAt ? new Date(dto.endedAt) : null;
        if (row.odometerEnd != null &&
            row.odometerStart != null &&
            dto.odometerEnd !== undefined) {
            row.distanceKm = Math.max(row.odometerEnd - row.odometerStart, 0);
        }
        return this.repo.save(row);
    }
};
exports.ErpVehicleTripsService = ErpVehicleTripsService;
exports.ErpVehicleTripsService = ErpVehicleTripsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_trip_entity_1.VehicleTrip)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sequence_service_1.SequenceService])
], ErpVehicleTripsService);
//# sourceMappingURL=vehicle-trips.service.js.map