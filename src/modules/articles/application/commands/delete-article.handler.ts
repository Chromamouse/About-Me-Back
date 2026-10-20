import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '../../../../../prisma/client/client';
import { PrismaArticlesRepository } from '../../infra/database/prisma-articles.repository';
import { DeleteArticleCommand } from './delete-article.command';

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleHandler implements ICommandHandler<DeleteArticleCommand> {
  constructor(private readonly articlesRepository: PrismaArticlesRepository) {}

  async execute(command: DeleteArticleCommand): Promise<void> {
    try {
      await this.articlesRepository.delete(command.id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Article with ID "${command.id}" was not found`,
        );
      }

      throw error;
    }
  }
}
