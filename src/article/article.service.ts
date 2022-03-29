import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  async createArticle(): Promise<any> {
    return 'method create article';
  }
}
