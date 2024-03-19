import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signIn')
  async login(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signIn(createUserDto);
  }

  @Post('/signUp')
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { tokens, userId } = await this.authService.signUp(createUserDto);

    response.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    response.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });

    return { message: 'Signup successful', userId };
  }
}
