import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { ListArticlesHandler } from './application/queries/list-articles.handler';
import { GetArticleHandler } from './application/queries/get-article.handler';
import { PrismaArticlesRepository } from './infra/database/prisma-articles.repository';
import { ArticlesController } from './infra/http/articles.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ArticlesController],
  providers: [PrismaArticlesRepository, ListArticlesHandler, GetArticleHandler],
})
export class ArticlesModule {}
