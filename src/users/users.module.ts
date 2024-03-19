import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Article } from '../articles/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Article])],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
