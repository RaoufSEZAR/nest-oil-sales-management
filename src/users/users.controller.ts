import {

  Controller,

  Get,

  Post,

  Body,

  Patch,

  Param,

  Delete,

  UseGuards,

  Query,

  Request,

} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { UsersService } from "src/users/users.service";

import { CreateUserDto } from "src/users/dto/create-user.dto";

import { UpdateUserDto } from "src/users/dto/update-user.dto";

import { User } from "src/users/entities/user.entity";

import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

import { RolesGuard } from "src/auth/guards/roles.guard";

import { Roles } from "src/auth/decorators/roles.decorator";

import { UserRole, USER_MANAGEMENT_ROLES } from "src/users/enums/user-role.enum";



@ApiTags('Users')

@Controller('users')

@UseGuards(JwtAuthGuard, RolesGuard)

@ApiBearerAuth()

export class UsersController {

  constructor(private readonly usersService: UsersService) {}



  @Post()

  @Roles(...USER_MANAGEMENT_ROLES)

  @ApiOperation({ summary: 'Create a new user (admin, super admin, or manager)' })

  @ApiResponse({ status: 201, description: 'User created successfully', type: User })

  @ApiResponse({ status: 400, description: 'Bad request' })

  @ApiResponse({ status: 409, description: 'User already exists' })

  @ApiResponse({ status: 403, description: 'Access denied' })

  create(@Body() createUserDto: CreateUserDto) {

    return this.usersService.create(createUserDto);

  }



  @Get()

  @Roles(...USER_MANAGEMENT_ROLES)

  @ApiOperation({ summary: 'Get all users (admin, super admin, or manager)' })

  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })

  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })

  @ApiResponse({ 

    status: 200, 

    description: 'Users retrieved successfully',

    schema: {

      type: 'object',

      properties: {

        data: { type: 'array', items: { $ref: '#/components/schemas/User' } },

        total: { type: 'number' },

        page: { type: 'number' },

        limit: { type: 'number' },

        totalPages: { type: 'number' }

      }

    }

  })

  @ApiResponse({ status: 403, description: 'Access denied' })

  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {

    const pageNum = page ? parseInt(page.toString()) : 1;

    const limitNum = limit ? parseInt(limit.toString()) : 10;

    return this.usersService.findAll(pageNum, limitNum);

  }



  @Get(':id')

  @Roles(...USER_MANAGEMENT_ROLES, UserRole.USER)

  @ApiOperation({ summary: 'Get user by ID (staff managers or own profile)' })

  @ApiResponse({ status: 200, description: 'User found', type: User })

  @ApiResponse({ status: 404, description: 'User not found' })

  @ApiResponse({ status: 403, description: 'Access denied' })

  findOne(@Param('id') id: string) {

    return this.usersService.findOne(id);

  }



  @Patch(':id')

  @Roles(...USER_MANAGEMENT_ROLES, UserRole.USER)

  @ApiOperation({ summary: 'Update user (staff managers or own profile)' })

  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })

  @ApiResponse({ status: 404, description: 'User not found' })

  @ApiResponse({ status: 409, description: 'Email already exists' })

  @ApiResponse({ status: 403, description: 'Access denied' })

  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user: { role: UserRole } },
  ) {
    const allowStaffPasswordReset = USER_MANAGEMENT_ROLES.some(
      (role) => role === req.user.role,
    );
    return this.usersService.update(id, updateUserDto, { allowStaffPasswordReset });
  }



  @Delete(':id')

  @Roles(...USER_MANAGEMENT_ROLES, UserRole.USER)

  @ApiOperation({ summary: 'Delete user (staff managers or own profile)' })

  @ApiResponse({ status: 200, description: 'User deleted successfully' })

  @ApiResponse({ status: 404, description: 'User not found' })

  @ApiResponse({ status: 403, description: 'Access denied' })

  remove(@Param('id') id: string) {

    return this.usersService.remove(id);

  }



  @Patch(':id/deactivate')

  @Roles(...USER_MANAGEMENT_ROLES)

  @ApiOperation({ summary: 'Deactivate user (admin, super admin, or manager)' })

  @ApiResponse({ status: 200, description: 'User deactivated successfully', type: User })

  @ApiResponse({ status: 404, description: 'User not found' })

  @ApiResponse({ status: 403, description: 'Access denied' })

  deactivate(@Param('id') id: string) {

    return this.usersService.deactivate(id);

  }



  @Patch(':id/activate')

  @Roles(...USER_MANAGEMENT_ROLES)

  @ApiOperation({ summary: 'Activate user (admin, super admin, or manager)' })

  @ApiResponse({ status: 200, description: 'User activated successfully', type: User })

  @ApiResponse({ status: 404, description: 'User not found' })

  @ApiResponse({ status: 403, description: 'Access denied' })

  activate(@Param('id') id: string) {

    return this.usersService.activate(id);

  }

}


