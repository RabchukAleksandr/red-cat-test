import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.articles, { onDelete: 'CASCADE' })
  author: User;
  constructor(article: Partial<Article>) {
    Object.assign(this, article);
  }
}
