import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Put,
	Param,
	Delete,
	UseGuards,
	Query,
	Request,
	ParseIntPipe,
} from "@nestjs/common";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
	ApiQuery,
} from "@nestjs/swagger";
import { UsersService } from "src/users/users.service";
import { HrService } from "src/users/hr.service";
import { UpdateHrSettingsDto } from "src/users/dto/update-hr-settings.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { AssignCenterDto } from "src/users/dto/assign-center.dto";
import { AssignVehicleDto } from "src/users/dto/assign-vehicle.dto";
import { UnassignDto } from "src/users/dto/unassign.dto";
import { ResetPasswordDto } from "src/users/dto/reset-password.dto";
import { User } from "src/users/entities/user.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import {
	UserRole,
	USER_MANAGEMENT_ROLES,
} from "src/users/enums/user-role.enum";

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly hrService: HrService,
	) {}

	@Post()
	@Roles(...USER_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Create a new user (admin, super admin, or manager)" })
	@ApiResponse({ status: 201, description: "User created successfully", type: User })
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get("me")
	@Roles(...USER_MANAGEMENT_ROLES, UserRole.USER)
	@ApiOperation({
		summary:
			"Current user profile with center and vehicle (legacy GET /users/me)",
	})
	@ApiResponse({ status: 200, description: "Profile found", type: User })
	getMe(@Request() req: { user: { userId: string } }) {
		return this.usersService.findOneWithRelations(req.user.userId);
	}

	@Get("center/:center_id")
	@Roles(...USER_MANAGEMENT_ROLES)
	@ApiOperation({
		summary: "Users assigned to a center (legacy GET /users/center/:center_id)",
	})
	@ApiResponse({ status: 200, description: "Users retrieved", type: [User] })
	findByCenter(@Param("center_id", ParseIntPipe) centerId: number) {
		return this.usersService.findByCenter(centerId);
	}

	@Get("hr/settings")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "HR settings for all active users (legacy)" })
	getHrSettings() {
		return this.hrService.getHrSettings();
	}

	@Get("hr/payroll/:month")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Monthly payroll report (legacy)" })
	getMonthlyPayroll(@Param("month") month: string) {
		return this.hrService.getMonthlyPayroll(month);
	}

	@Get()
	@Roles(...USER_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "List users with optional filters and pagination" })
	@ApiQuery({ name: "page", required: false, type: Number })
	@ApiQuery({ name: "limit", required: false, type: Number })
	@ApiQuery({ name: "role", required: false, enum: UserRole })
	@ApiQuery({ name: "center_id", required: false, type: Number })
	@ApiQuery({
		name: "active",
		required: false,
		type: Boolean,
		description: "Filter by isActive (true/false)",
	})
	@ApiResponse({ status: 200, description: "Users retrieved successfully" })
	findAll(
		@Query("page") page?: number,
		@Query("limit") limit?: number,
		@Query("role") role?: UserRole,
		@Query("center_id") centerIdRaw?: string,
		@Query("active") activeRaw?: string,
	) {
		const pageNum = page ? parseInt(page.toString(), 10) : 1;
		const limitNum = limit ? parseInt(limit.toString(), 10) : 10;
		const centerId =
			centerIdRaw !== undefined && centerIdRaw !== ""
				? parseInt(centerIdRaw, 10)
				: undefined;
		let active: boolean | undefined;
		if (activeRaw === "true") active = true;
		else if (activeRaw === "false") active = false;

		return this.usersService.findAll(pageNum, limitNum, {
			role,
			centerId,
			active,
		});
	}

	@Get(":id")
	@Roles(...USER_MANAGEMENT_ROLES, UserRole.USER)
	@ApiOperation({ summary: "Get user by ID (staff managers or own profile)" })
	@ApiResponse({ status: 200, description: "User found", type: User })
	findOne(@Param("id") id: string) {
		return this.usersService.findOneWithRelations(id);
	}

	@Put(":id/assign-center")
	@Roles(...USER_MANAGEMENT_ROLES)
	@ApiOperation({
		summary: "Assign user to center (legacy PUT /users/:id/assign-center)",
	})
	@ApiResponse({ status: 200, description: "User assigned to center", type: User })
	assignToCenter(
		@Param("id") id: string,
		@Body() dto: AssignCenterDto,
	) {
		return this.usersService.assignToCenter(id, dto.center_id);
	}

	@Put(":id/assign-vehicle")
	@Roles(...USER_MANAGEMENT_ROLES)
	@ApiOperation({
		summary: "Assign user to vehicle (legacy PUT /users/:id/assign-vehicle)",
	})
	@ApiResponse({ status: 200, description: "User assigned to vehicle", type: User })
	assignToVehicle(
		@Param("id") id: string,
		@Body() dto: AssignVehicleDto,
	) {
		return this.usersService.assignToVehicle(id, dto.vehicle_id);
	}

	@Put(":id/unassign")
	@Roles(...USER_MANAGEMENT_ROLES)
	@ApiOperation({
		summary: "Unassign user from vehicle/center (legacy PUT /users/:id/unassign)",
	})
	@ApiResponse({ status: 200, description: "Assignment removed", type: User })
	unassign(@Param("id") id: string, @Body() dto: UnassignDto) {
		return this.usersService.unassign(id, dto.remove);
	}

	@Put(":id/hr-settings")
	@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
	@ApiOperation({ summary: "Update HR settings for a user (legacy)" })
	updateHrSettings(
		@Param("id") id: string,
		@Body() dto: UpdateHrSettingsDto,
	) {
		return this.hrService.updateHrSettings(id, dto);
	}

	@Put(":id/toggle-active")
	@Roles(...USER_MANAGEMENT_ROLES)
	@ApiOperation({
		summary: "Toggle user active flag (legacy PUT /users/:id/toggle-active)",
	})
	@ApiResponse({ status: 200, description: "User active status toggled", type: User })
	toggleActive(@Param("id") id: string) {
		return this.usersService.toggleActive(id);
	}

	@Patch(":id/reset-password")
	@Roles(...USER_MANAGEMENT_ROLES)
	@ApiOperation({
		summary: "Reset user password (legacy admin reset, min 4 chars)",
	})
	@ApiResponse({ status: 200, description: "Password reset successfully" })
	resetPassword(@Param("id") id: string, @Body() dto: ResetPasswordDto) {
		return this.usersService.resetPassword(id, dto.password);
	}

	@Patch(":id/deactivate")
	@Roles(...USER_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Deactivate user" })
	@ApiResponse({ status: 200, description: "User deactivated", type: User })
	deactivate(@Param("id") id: string) {
		return this.usersService.deactivate(id);
	}

	@Patch(":id/activate")
	@Roles(...USER_MANAGEMENT_ROLES)
	@ApiOperation({ summary: "Activate user" })
	@ApiResponse({ status: 200, description: "User activated", type: User })
	activate(@Param("id") id: string) {
		return this.usersService.activate(id);
	}

	@Patch(":id")
	@Roles(...USER_MANAGEMENT_ROLES, UserRole.USER)
	@ApiOperation({ summary: "Update user (staff managers or own profile)" })
	@ApiResponse({ status: 200, description: "User updated", type: User })
	update(
		@Param("id") id: string,
		@Body() updateUserDto: UpdateUserDto,
		@Request() req: { user: { role: UserRole } },
	) {
		const allowStaffPasswordReset = USER_MANAGEMENT_ROLES.some(
			(role) => role === req.user.role,
		);
		return this.usersService.update(id, updateUserDto, {
			allowStaffPasswordReset,
		});
	}

	@Delete(":id")
	@Roles(...USER_MANAGEMENT_ROLES, UserRole.USER)
	@ApiOperation({ summary: "Delete user" })
	@ApiResponse({ status: 200, description: "User deleted" })
	remove(@Param("id") id: string) {
		return this.usersService.remove(id);
	}
}
