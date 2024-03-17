import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";

@Controller({ path: "articles", version: "1" })
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {
  }

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return await this.articlesService.create(createArticleDto);
  }

  @Get()
  async findAll() {
    return await this.articlesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.articlesService.findOne(+id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return await this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.articlesService.remove(+id);
  }
}