import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  create(@Body() userRoleDto: CreateUserRoleDto) {
    return this.usersService.createUser(userRoleDto);
  }

  @Get()
  get() {
    return this.usersService.getUser();
  }
}
