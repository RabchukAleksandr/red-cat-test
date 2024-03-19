import { Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller({ path: 'roles', version: '1' })
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Post()
  async seedData() {
    await this.roleService.seedData();
    return 'Database seeded successfully!';
  }
}
