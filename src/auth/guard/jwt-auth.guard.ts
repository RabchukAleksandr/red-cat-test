import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
        this.jwtService
          .signAsync(payload, {
            secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
            expiresIn: '60m',
          })
          .then((accessToken: string) => {
            res.cookie('accessToken', accessToken, { httpOnly: true });
          })
          .catch(() => {
            throw new UnauthorizedException({ message: 'Unauthorized' });
          });
      }

      if (!decodedAccessToken || typeof decodedAccessToken.exp !== 'number') {
        throw new UnauthorizedException({ message: 'Invalid access token' });
      }

      req.user = decodedAccessToken;
      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
  }
}
