import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaArticlesRepository } from '../../infra/database/prisma-articles.repository';
import { ArticleNotFoundException } from '../../model/Article-not-found.exception';
import { UpdateArticleCommand } from './update-article.command';
import type { Article } from '../../model/article';

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleHandler implements ICommandHandler<UpdateArticleCommand> {
  constructor(private readonly articlesRepository: PrismaArticlesRepository) {}

  async execute(command: UpdateArticleCommand): Promise<Article> {
    const exists = await this.articlesRepository.exists(command.id);

    if (!exists) {
      throw new ArticleNotFoundException(command.id);
    }

    const { id, ...data } = command;

    return this.articlesRepository.update(id, data);
  }
}
