import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @Put('/:id/roles')
  attachRoleToUser(
    @Param('id') id: number,
    @Body() userRoleDto: CreateUserRoleDto,
  ) {
    return this.usersService.attachRolesToUser(userRoleDto, id);
  }

  @Get()
  get() {
    return this.usersService.getUser();
  }
}
