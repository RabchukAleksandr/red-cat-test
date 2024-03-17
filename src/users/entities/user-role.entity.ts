import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
