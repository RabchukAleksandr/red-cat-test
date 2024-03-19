import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { User } from '../entities/user.entity';
import { getReqRouteInstanceName } from '../../common/getReqRouteInstanceName';

@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;
    const resourceInstanceName = getReqRouteInstanceName(request.originalUrl);

    const dbUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { activeRole: true },
    });

    switch (resourceInstanceName) {
      case 'articles':
        const article = await this.articleRepository.findOne({
          where: { id: params.id },
          relations: { author: true },
        });
        if (!article) {
          throw new NotFoundException(`Article with id ${params.id} not found`);
        }
        return article.author.id === user.id;
      case 'users':
        if (!dbUser) {
          throw new NotFoundException(`User with id ${user.id} not found`);
        }
        return dbUser.id === user.id;
      default:
        return false;
    }
  }
}
