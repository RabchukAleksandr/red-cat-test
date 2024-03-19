import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    try {
      const accessToken = req.cookies['accessToken'];

      if (!accessToken) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }

      const decodedAccessToken = this.jwtService.verify(accessToken, {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        ignoreExpiration: true,
      });

      const user = await this.userRepository.findOne({
        where: { id: decodedAccessToken.id },
      });

      if (!user) {
        throw new UnauthorizedException({
          message: `User with id ${decodedAccessToken.id} does not exist`,
        });
      }

      if (!decodedAccessToken || typeof decodedAccessToken.exp !== 'number') {
        throw new UnauthorizedException({ message: 'Invalid access token' });
      }

      const isAccessTokenExpired =
        decodedAccessToken.exp <= Math.floor(Date.now() / 1000);

      if (isAccessTokenExpired) {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
          throw new UnauthorizedException({ message: 'Unauthorized' });
        }
        const decodedRefreshToken = this.jwtService.verify(refreshToken, {
          secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        });
        const payload = {
          email: decodedRefreshToken.email,
          id: decodedRefreshToken.id,
        };
        const accessToken = await this.jwtService.signAsync(payload, {
          secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
          expiresIn: '60m',
        });

        res.cookie('accessToken', accessToken, { httpOnly: true });
      }

      req.user = decodedAccessToken;
      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: e.message });
    }
  }
}
