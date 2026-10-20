import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '../../../../../prisma/client/client';
import { PrismaArticlesRepository } from '../../infra/database/prisma-articles.repository';
import type { Article } from '../../model/article';
import { UpdateArticleCommand } from './update-article.command';

@CommandHandler(UpdateArticleCommand)
@Injectable()
export class UpdateArticleHandler implements ICommandHandler<UpdateArticleCommand> {
  constructor(private readonly articlesRepository: PrismaArticlesRepository) {}

  async execute(command: UpdateArticleCommand): Promise<Article> {
    try {
      const data: { title?: string; text?: string } = {};

      if (command.title !== undefined) {
        data.title = command.title;
      }

      if (command.text !== undefined) {
        data.text = command.text;
      }

      return await this.articlesRepository.update(command.id, data);
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
