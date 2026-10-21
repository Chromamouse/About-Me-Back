import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaArticlesRepository } from '../../infra/database/prisma-articles.repository';
import { DeleteArticleCommand } from './delete-article.command';
import { ArticleNotFoundException } from '../../model/Article-not-found.exception';

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleHandler implements ICommandHandler<DeleteArticleCommand> {
  constructor(private readonly articlesRepository: PrismaArticlesRepository) {}

  async execute(command: DeleteArticleCommand): Promise<void> {
    const exists = await this.articlesRepository.exists(command.id);

    if (!exists) {
      throw new ArticleNotFoundException(command.id);
    }

    await this.articlesRepository.delete(command.id);
  }
}
