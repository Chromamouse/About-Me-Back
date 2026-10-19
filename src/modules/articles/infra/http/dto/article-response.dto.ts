import { OmitType, PickType, PartialType } from '@nestjs/swagger';
import { Article } from '../../../model/article';

export class ArticleResponseDto extends PickType(Article, [
  'id',
  'title',
  'text',
  'publishedAt',
] as const) {}

export class CreateArticleDto extends OmitType(Article, [
  'id',
  'publishedAt',
] as const) {}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
