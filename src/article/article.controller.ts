import { UserDecorator } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { Request } from 'express';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAllArticle(
    @UserDecorator('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return this.articleService.getAllArticle(currentUserId, query);
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
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

  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateArticle(
    @Param('slug') slug: string,
    @UserDecorator('id') currentUserId: number,
    @Body() updateDtoArticle: UpdateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(
      slug,
      currentUserId,
      updateDtoArticle,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/favorites')
  @UseGuards(AuthGuard)
  async addArticleToFavorite(@Param('slug') slug: string): Promise<any> {
    return 'yes';
  }

  @Get('slug')
  async getSlug(@Req() req: Request) {
    const res = await this.articleService.processSlugUnique('Stringa');
    console.log(res);
    console.log(req);
    return res;
  }
}
