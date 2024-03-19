import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResourceOwnerGuard } from './guard/resource-owner.guard';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/authenticated-request.interface';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @Put(':id/roles')
  attachRoleToUser(
    @Param('id') id: number,
    @Body() userRoleDto: CreateUserRoleDto,
  ) {
    return this.usersService.attachRolesToUser(userRoleDto, id);
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
