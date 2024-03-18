import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { DEFAULT_USER_ROLE } from '../../config';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly entityManager: EntityManager,
  ) {}

  async attachRolesToUser(
    createUserRoleDto: CreateUserRoleDto,
    userId: number,
  ) {
    const { roles, activeRole } = createUserRoleDto;

    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    if (activeRole && !roles.includes(activeRole)) {
      throw new HttpException(
        'Active role should be included in roles array',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (roles.includes('admin')) {
      throw new HttpException(
        "Can't set admin role to user by default",
        HttpStatus.BAD_REQUEST,
      );
    }

    const dbRoles = await this.roleRepository.find();

    const defaultUserRole = await this.roleRepository.findOne({
      where: { value: DEFAULT_USER_ROLE },
    });

    if (!defaultUserRole)
      throw new InternalServerErrorException(
        'Cannot attach a role as default role is missing',
      );

    user.roles = dbRoles.filter((role) => roles.includes(role.value)) ?? [
      defaultUserRole,
    ];

    user.activeRole =
      dbRoles.find((role) => role.value === activeRole) ?? defaultUserRole;

    await this.entityManager.save(user);

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    await this.entityManager.save(user);
    return user;
  }

  async getUser() {
    return await this.userRepository.findOne({
      where: { id: 2 },
      relations: { roles: true, activeRole: true },
    });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
}
