import { UserDecorator } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createArticle(
    @UserDecorator() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get('getArticleBySlug')
  @UseGuards(AuthGuard)
  async getBySlug(
    @Body('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @UserDecorator('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<DeleteResult> {
    return this.articleService.deleteArticle(slug, currentUserId);
  }

  @Post(':slug')
  @UseGuards(AuthGuard)
  async updateUrticle(): Promise<any> {
    return this.articleService.updateArticle();
  }

  @Get('slug')
  getSlug() {
    return this.articleService.processSlugUnique('new-yourk-some');
  }
}
