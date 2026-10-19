import { ApiProperty } from '@nestjs/swagger';

export class Article {
  @ApiProperty({
    example: '5e1f0a2b-0001-4000-8000-000000000003',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({ example: 'Learning Prisma' }) title: string;

  @ApiProperty({
    example: 'An introduction to database models, migrations, and queries.',
  })
  text: string;

  @ApiProperty({ example: '2026-03-20T10:00:00.000Z', format: 'date-time' })
  publishedAt: Date;
}
