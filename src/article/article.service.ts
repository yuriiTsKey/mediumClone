import { UserEntity } from '@app/user/user.entity';
import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import slugify from 'slugify';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }
    const randomSlug = this.processSlugUnique(article.title);
    this.checkArticleIfExistBySlug(randomSlug);
    article.slug = randomSlug;

    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async getArticleBySlug(slugArticle: string): Promise<ArticleEntity> {
    const articleFinded = await this.articleRepository.findOne({
      slug: slugArticle,
    });
    return articleFinded;
  }

  async checkArticleIfExistBySlug(slugArticle: string): Promise<any> {
    try {
      const slugObjInDb = await this.articleRepository.findOne({
        slug: slugArticle,
      });
      if (slugObjInDb.slug != slugArticle) {
        return '';
      } else {
        throw new HttpException(
          'This article has already registered',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      return '';
    }
  }

  async deleteArticle(
    slugArticle: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.getArticleBySlug(slugArticle);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id != currentUserId) {
      throw new HttpException(
        'You are not author ot this article',
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
    return await this.articleRepository.delete({ slug: slugArticle });
  }

  async updateArticle(
    slug: string,
    currentUserId: number,
    updateDtoArticle: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id != currentUserId) {
      throw new HttpException(
        'You are not author ot this article',
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
    console.log(updateDtoArticle);
    Object.assign(article, updateDtoArticle);
    console.log(article);
    return await this.articleRepository.save(article);
  }

  buildArticleResponse(article: ArticleEntity) {
    return { article };
  }

  processSlugUnique(title: string): string {
    const slugString = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    return (
      slugify(title, {
        lower: true,
      }) +
      '-' +
      slugString
    );
  }
}
