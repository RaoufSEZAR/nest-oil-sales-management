import {
	Injectable,
	NotFoundException,
	ConflictException,
	BadRequestException,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Center } from "src/centers/entities/center.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { UserRole } from "src/users/enums/user-role.enum";
import * as bcrypt from "bcrypt";

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
] as const;

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(Vehicle)
		private vehiclesRepository: Repository<Vehicle>,
		@InjectRepository(Center)
		private centersRepository: Repository<Center>,
		private dataSource: DataSource,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const existingUser = await this.usersRepository.findOne({
			where: { email: createUserDto.email },
		});

		if (existingUser) {
			throw new ConflictException("User with this email already exists");
		}

		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
		const user = this.usersRepository.create({
			...createUserDto,
			password: hashedPassword,
		});
		return this.usersRepository.save(user);
	}

	async findAll(
		page: number = 1,
		limit: number = 10,
		filters?: {
			role?: UserRole;
			centerId?: number;
			active?: boolean;
		},
	): Promise<{
		data: User[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const where: FindOptionsWhere<User> = {};
		if (filters?.role) where.role = filters.role;
		if (filters?.centerId !== undefined) where.centerId = filters.centerId;
		if (filters?.active !== undefined) where.isActive = filters.active;

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

	async findByCenter(centerId: number): Promise<User[]> {
		return this.usersRepository.find({
			where: { centerId },
			select: [...USER_LIST_SELECT],
			relations: ["vehicle"],
			order: { role: "ASC", firstName: "ASC", lastName: "ASC" },
		});
	}

	async findOne(id: string): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: { id },
			select: [...USER_LIST_SELECT],
		});

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return user;
	}

	async findOneWithRelations(id: string): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: { id },
			select: [...USER_LIST_SELECT],
			relations: ["center", "vehicle"],
		});

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return user;
	}

	async findOneWithPassword(id: string): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: { id },
			select: [
				...USER_LIST_SELECT,
				"password",
			],
		});

		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		if (!user.password) {
			throw new NotFoundException(
				`User password not found for user with ID ${id}`,
			);
		}

		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.usersRepository.findOne({
			where: { email },
		});
	}

	async update(
		id: string,
		updateUserDto: UpdateUserDto,
		options?: { allowStaffPasswordReset?: boolean },
	): Promise<User> {
		const user = await this.findOne(id);

		if (updateUserDto.email && updateUserDto.email !== user.email) {
			const existingUser = await this.usersRepository.findOne({
				where: { email: updateUserDto.email },
			});

			if (existingUser) {
				throw new ConflictException("User with this email already exists");
			}
		}

		if (updateUserDto.password) {
			const trimmedNewPassword = updateUserDto.password.trim();

			if (options?.allowStaffPasswordReset && !updateUserDto.oldPassword) {
				updateUserDto.password = await bcrypt.hash(trimmedNewPassword, 10);
			} else {
				if (!updateUserDto.oldPassword) {
					throw new BadRequestException(
						"Old password is required when changing password",
					);
				}

				const userWithPassword = await this.findOneWithPassword(id);
				const trimmedOldPassword = updateUserDto.oldPassword.trim();
				const isOldPasswordValid = await bcrypt.compare(
					trimmedOldPassword,
					userWithPassword.password,
				);
				if (!isOldPasswordValid) {
					throw new UnauthorizedException("Old password is incorrect");
				}

				updateUserDto.password = await bcrypt.hash(trimmedNewPassword, 10);
			}
		}

		const { oldPassword, ...updateData } = updateUserDto;

		Object.assign(user, updateData);
		return this.usersRepository.save(user);
	}

	async resetPassword(id: string, password: string): Promise<{ message: string }> {
		const user = await this.usersRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		user.password = await bcrypt.hash(password.trim(), 10);
		await this.usersRepository.save(user);

		return { message: "Password reset successfully" };
	}

	async remove(id: string): Promise<void> {
		const user = await this.findOne(id);
		await this.usersRepository.remove(user);
	}

	async deactivate(id: string): Promise<User> {
		const user = await this.findOne(id);
		user.isActive = false;
		return this.usersRepository.save(user);
	}

	async activate(id: string): Promise<User> {
		const user = await this.findOne(id);
		user.isActive = true;
		return this.usersRepository.save(user);
	}

	async toggleActive(id: string): Promise<User> {
		const user = await this.findOne(id);
		user.isActive = !user.isActive;
		return this.usersRepository.save(user);
	}

	async assignToCenter(userId: string, centerId: number): Promise<User> {
		const [user, center] = await Promise.all([
			this.usersRepository.findOne({ where: { id: userId } }),
			this.centersRepository.findOne({ where: { id: centerId } }),
		]);

		if (!user) {
			throw new NotFoundException(`User with ID ${userId} not found`);
		}
		if (!center) {
			throw new NotFoundException(`Center with ID ${centerId} not found`);
		}

		user.centerId = centerId;
		await this.usersRepository.save(user);

		return this.findOneWithRelations(userId);
	}

	async assignToVehicle(userId: string, vehicleId: number): Promise<User> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const user = await queryRunner.manager.findOne(User, {
				where: { id: userId },
			});
			const vehicle = await queryRunner.manager.findOne(Vehicle, {
				where: { id: vehicleId },
			});

			if (!user) {
				throw new NotFoundException(`User with ID ${userId} not found`);
			}
			if (!vehicle) {
				throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
			}

			user.vehicleId = vehicleId;
			user.centerId = vehicle.centerId;
			await queryRunner.manager.save(User, user);

			vehicle.currentSalesRepId = userId;
			await queryRunner.manager.save(Vehicle, vehicle);

			await queryRunner.commitTransaction();
		} catch (e) {
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}

		return this.findOneWithRelations(userId);
	}

	async unassign(
		userId: string,
		remove: "vehicle" | "center" | "all",
	): Promise<User> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const user = await queryRunner.manager.findOne(User, {
				where: { id: userId },
			});

			if (!user) {
				throw new NotFoundException(`User with ID ${userId} not found`);
			}

			if (remove === "vehicle" || remove === "all") {
				if (user.vehicleId) {
					await queryRunner.manager.update(
						Vehicle,
						{ id: user.vehicleId, currentSalesRepId: userId },
						{ currentSalesRepId: null },
					);
				}
				user.vehicleId = null;
			}

			if (remove === "center" || remove === "all") {
				user.centerId = null;
			}

			await queryRunner.manager.save(User, user);
			await queryRunner.commitTransaction();
		} catch (e) {
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}

		return this.findOneWithRelations(userId);
	}
}
