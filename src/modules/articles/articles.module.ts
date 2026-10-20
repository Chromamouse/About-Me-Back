import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { CreateArticleHandler } from './application/commands/create-article.handler';
import { GetArticleHandler } from './application/queries/get-article.handler';
import { ListArticlesHandler } from './application/queries/list-articles.handler';
import { PrismaArticlesRepository } from './infra/database/prisma-articles.repository';
import { ArticlesController } from './infra/http/articles.controller';
import { UpdateArticleHandler } from './application/commands/update-article.handler';
import { DeleteArticleHandler } from './application/commands/delete-article.handler';

@Module({
  imports: [PrismaModule, CqrsModule],
  controllers: [ArticlesController],
  providers: [
    PrismaArticlesRepository,
    ListArticlesHandler,
    GetArticleHandler,
    CreateArticleHandler,
    UpdateArticleHandler,
    DeleteArticleHandler,
  ],
})
export class ArticlesModule {}
