import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import type { Article } from '../../model/article';

type ArticleWriteData = Pick<Article, 'title' | 'text'>;

@Injectable()
export class PrismaArticlesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<Article[]> {
    return this.prisma.article.findMany({
      orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    });
  }

  async findById(id: string): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: { id: true },
    });

    return article !== null;
  }

  async create(data: ArticleWriteData): Promise<Article> {
    return this.prisma.article.create({
      data,
    });
  }

  async update(id: string, data: Partial<ArticleWriteData>): Promise<Article> {
    return this.prisma.article.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.article.delete({
      where: { id },
    });
  }
}
