import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { ResourceOwnerGuard } from './guard/resource-guard.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/authenticated-request.interface';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard, ResourceOwnerGuard)
  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }
  @Put(':id/roles')
  async updateUserRoles(
    @Param('id') id: number,
    @Body() userRoleDto: CreateUserRoleDto,
  ) {
    return await this.usersService.updateUserRoles(userRoleDto, id);
  }

  @UseGuards(JwtAuthGuard, ResourceOwnerGuard)
  @Delete(':id')
  async deleteMe(@Req() request: AuthenticatedRequest) {
    const userId = request.user.id;
    return await this.usersService.deleteUser(userId);
  }
  @UseGuards(JwtAuthGuard, ResourceOwnerGuard)
  @Delete(':id')
  async deleteUser(@Param() id: string) {
    return await this.usersService.deleteUser(+id);
  }
}
