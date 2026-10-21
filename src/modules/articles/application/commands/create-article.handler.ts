import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaArticlesRepository } from '../../infra/database/prisma-articles.repository';
import type { Article } from '../../model/article';
import { CreateArticleCommand } from './create-article.command';

@CommandHandler(CreateArticleCommand)
export class CreateArticleHandler implements ICommandHandler<CreateArticleCommand> {
  constructor(private readonly articlesRepository: PrismaArticlesRepository) {}

  async execute(command: CreateArticleCommand): Promise<Article> {
    return this.articlesRepository.create({
      title: command.title,
      text: command.text,
    });
  }
}
