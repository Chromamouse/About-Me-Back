import { PrismaService } from '../../src/core/prisma/prisma.service';

const prisma = new PrismaService();

const articles = [
  {
    id: '5e1f0a2b-0001-4000-8000-000000000001',
    title: 'Welcome to My Blog',
    text: 'Welcome to my blog! Here I share my projects and experiences.',
    publishedAt: new Date('2026-01-10T10:00:00.000Z'),
  },
  {
    id: '5e1f0a2b-0001-4000-8000-000000000002',
    title: 'Building My First API',
    text: 'An introduction to REST APIs and backend development.',
    publishedAt: new Date('2026-02-15T10:00:00.000Z'),
  },
  {
    id: '5e1f0a2b-0001-4000-8000-000000000003',
    title: 'Learning Prisma',
    text: 'An introduction to database models, migrations, and queries.',
    publishedAt: new Date('2026-03-20T10:00:00.000Z'),
  },
];

export async function main(): Promise<void> {
  await prisma.$transaction([
    prisma.article.deleteMany(),
    prisma.article.createMany({
      data: articles,
    }),
  ]);
}

if (require.main === module) {
  main()
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(async () => {
      void prisma.$disconnect();
    });
}
