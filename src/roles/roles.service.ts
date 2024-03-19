import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async seedData() {
    const postData: Partial<Role>[] = [
      {
        value: 'admin',
        description:
          'Manage users (read, delete).Manage articles (read, delete), regardless of who created them.',
      },
      {
        value: 'editor',
        description:
          'Create and read articles, update and delete their articles.',
      },
      {
        value: 'viewer',
        description: 'Read-only access to articles.',
      },
    ];

    try {
      await this.roleRepository.save(postData);
      Logger.log('Data seeded successfully');
    } catch (error) {
      Logger.error(`Error seeding data: ${error.message}`, error.stack);
    }
  }
}
