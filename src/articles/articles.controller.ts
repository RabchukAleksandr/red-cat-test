import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../roles/guard/roles.guard';
import { Roles } from '../roles/decorator/roles-auth.decorator';
import { AuthenticatedRequest } from '../common/authenticated-request.interface';
import { ResourceOwnerGuard } from '../users/guard/resource-guard.service';

@Controller({ path: 'articles', version: '1' })
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('editor')
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.id;
    return await this.articlesService.create(createArticleDto, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Roles('editor', 'admin', 'viewer')
  @UseGuards(RolesGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.articlesService.findAll(page, limit);
  }
  @Roles('editor', 'admin', 'viewer')
  @UseGuards(RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.articlesService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard, ResourceOwnerGuard)
  @Roles('editor')
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articlesService.update(+id, updateArticleDto);
  }
  @UseGuards(JwtAuthGuard, ResourceOwnerGuard)
  @Roles('editor', 'admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.articlesService.remove(+id);
  }
}
