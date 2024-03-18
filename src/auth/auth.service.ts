import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signIn(createUserDto: CreateUserDto) {
    const user = await this.validateUser(createUserDto);
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  async signUp(createUserDto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(
      createUserDto.email,
    );
    if (candidate) {
      throw new HttpException('User exists', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.createUser({
      password: hashPassword,
      email: createUserDto.email,
    });
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  private async getTokens(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: '100m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  async updateRefreshToken(user: User, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async validateUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(createUserDto.email);
    const passwordEquals = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );
    if (user && passwordEquals) return user;
    throw new UnauthorizedException({ message: 'Wrong credentials' });
  }
}
