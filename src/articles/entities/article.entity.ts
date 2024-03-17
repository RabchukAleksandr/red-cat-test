import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  text: string

  @Column()
  author: string

  constructor(article: Partial<Article>) {
    Object.assign(this, article)
  }
}
