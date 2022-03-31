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
    article.slug = this.processSlugUnique(article.title);

    try {
      await this.getArticleBySlug(article.slug);
    } catch (err) {
      throw new Error('This slug just already exist');
    }

    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async getArticleBySlug(slugArticle: string): Promise<ArticleEntity> {
    const articleFinded = await this.articleRepository.findOne({
      slug: slugArticle,
    });
    if (articleFinded) {
      return articleFinded;
    }
    throw new HttpException(
      'this article not exist in db',
      HttpStatus.FAILED_DEPENDENCY,
    );
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

  async updateArticle(): Promise<any> {
    return 'updated';
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
