import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
config({ path: '.development.env' });
export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const rolesRepository = dataSource.getRepository(Role);
    const entityManager = dataSource.createEntityManager();
    const jwtService = new JwtService();
    const roles: Partial<Role>[] = [
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
    await rolesRepository.save(roles);

    const dbRoles = await rolesRepository.find();
    const adminRole = dbRoles.find((role) => role.value === 'admin');

    const user = new User({
      email: 'admin@mail.com',
      password: await bcrypt.hash('admin_password', 10),
      refreshToken: await jwtService.signAsync(
        { email: 'admin@mail.com', id: 1 },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    });

    user.activeRole = adminRole;

    user.roles = dbRoles;

    await entityManager.save(user);
  }
}
