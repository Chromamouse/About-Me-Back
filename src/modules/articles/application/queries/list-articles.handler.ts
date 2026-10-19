import { Injectable } from '@nestjs/common';
import { PrismaArticlesRepository } from '../../infra/database/prisma-articles.repository';
import type { Article } from '../../model/article';

@Injectable()
export class ListArticlesHandler {
  constructor(private readonly articlesRepository: PrismaArticlesRepository) {}

  async execute(): Promise<Article[]> {
    return this.articlesRepository.list();
  }
}
