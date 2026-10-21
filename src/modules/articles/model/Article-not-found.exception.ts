import { NotFoundException } from '@nestjs/common';

export class ArticleNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Article with ID "${id}" was not found`);
  }
}
