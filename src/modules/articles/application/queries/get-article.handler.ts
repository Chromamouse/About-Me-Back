import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaArticlesRepository } from '../../infra/database/prisma-articles.repository';
import type { Article } from '../../model/article';
import { GetArticleQuery } from './get-article.query';

@Injectable()
export class GetArticleHandler {
  constructor(private readonly articlesRepository: PrismaArticlesRepository) {}

  async execute(query: GetArticleQuery): Promise<Article> {
    const article = await this.articlesRepository.findById(query.id);

    if (!article) {
      throw new NotFoundException(
        `Article with ID "${query.id}" was not found`,
      );
    }

    return article;
  }
}
