import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserRoleDto } from '../users/dto/create-user-role.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }

  @Post('/registration')
  registration(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.authService.registration(createUserRoleDto);
  }
}
