import { Controller, Post } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('create')
  async createArticle(): Promise<any> {
    return this.articleService.createArticle();
  }
}
