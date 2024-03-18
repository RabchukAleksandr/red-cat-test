import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly entityManager: EntityManager,
  ) {}

  async createUser(CreateUserDto: CreateUserDto) {
    const user = new User(CreateUserDto);
    const roles = await this.roleRepository.find();
    user.roles = roles;
    user.activeRole = roles[0];
    console.log(user);
    await this.entityManager.save(user);
  }
}
