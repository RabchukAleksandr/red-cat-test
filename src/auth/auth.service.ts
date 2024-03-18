import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { CreateUserRoleDto } from '../users/dto/create-user-role.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(createUserRoleDto: CreateUserRoleDto) {
    const candidate = await this.usersService.getUserByEmail(
      createUserRoleDto.user.email,
    );
    if (candidate) {
      throw new HttpException('User exists', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(createUserRoleDto.user.password, 10);
    const user = await this.usersService.createUser({
      ...createUserRoleDto,
      user: { password: hashPassword, email: createUserRoleDto.user.email },
    });
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) return user;
    throw new UnauthorizedException({ message: 'Wrong credentials' });
  }
}
