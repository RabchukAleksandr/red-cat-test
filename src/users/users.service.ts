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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly entityManager: EntityManager,
  ) {}

  async createUser(createUserRoleDto: CreateUserRoleDto) {
    const { user: createUserDto, role: attachRoleDto } = createUserRoleDto;

    const isActiveRoleInValid =
      !!attachRoleDto.activeRole &&
      !attachRoleDto.roles.includes(attachRoleDto.activeRole);

    if (isActiveRoleInValid) {
      throw new HttpException(
        'Active role should be included in roles array',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (attachRoleDto.roles.includes('admin')) {
      throw new HttpException(
        "Can't set admin role to user by default",
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User(createUserDto);

    const roles = await this.roleRepository.find();

    const defaultUserRole = await this.roleRepository.findOne({
      where: { value: DEFAULT_USER_ROLE },
    });

    if (!defaultUserRole)
      throw new InternalServerErrorException(
        'User cannot be created as default role is missing',
      );

    user.roles = roles.filter((role) =>
      attachRoleDto.roles.includes(role.value),
    ) ?? [defaultUserRole];

    user.activeRole =
      roles.find((role) => role.value === attachRoleDto.activeRole) ??
      defaultUserRole;

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
