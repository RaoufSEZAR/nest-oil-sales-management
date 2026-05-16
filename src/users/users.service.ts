import {
	Injectable,
	NotFoundException,
	ConflictException,
	BadRequestException,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		// Check if user already exists
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
	): Promise<{
		data: User[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
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
				"centerId",
				"createdAt",
				"updatedAt",
			],
			relations: ["center"],
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

	async findOne(id: string): Promise<User> {
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
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		return user;
	}

	async findOneWithPassword(id: string): Promise<User> {
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
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		if (!user.password) {
			throw new NotFoundException(
				`User password not found for user with ID ${id}`,
			);
		}

		return user;
	}

	async findByEmail(email: string): Promise<User> {
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

		// Check if email is being updated and if it already exists
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

		// Remove oldPassword from DTO before saving (it's not a database field)
		const { oldPassword, ...updateData } = updateUserDto;

		Object.assign(user, updateData);
		return this.usersRepository.save(user);
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
}
