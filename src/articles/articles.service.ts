import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { EntityManager, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = new Article(createArticleDto);
    await this.entityManager.save(article);
  }

  async findAll() {
    return await this.articleRepository.find();
  }

  async findOne(id: number) {
    return await this.articleRepository.findOneBy({ id });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    let article = await this.articleRepository.findOneBy({ id });

    if (!article) {
      throw new Error('Article not found');
    }

    await this.entityManager.save(Article, { ...article, ...updateArticleDto });
  }

  async remove(id: number) {
    await this.articleRepository.delete(id);
  }
}
