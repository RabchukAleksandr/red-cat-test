import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @ManyToOne(() => Role)
  @JoinTable()
  activeRole: Role;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
