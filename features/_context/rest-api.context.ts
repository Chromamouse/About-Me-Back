import { When, Then, Given, After } from '@cucumber/cucumber';
import axios, { AxiosResponse } from 'axios';
import expect from 'expect';
import { execSync } from 'child_process';
import { deepCompare } from '../_helper/deep-compare';
import { AfterAll } from '@cucumber/cucumber';
import { PrismaService } from '../../src/core/prisma/prisma.service';
import { main as seedArticles } from '../../prisma/seed/seed';

const apiBaseUrl = 'http://localhost:3000';
let apiToken: string | null = null;
let apiResponse: AxiosResponse;

Given('I use seed data', async () => {
  await seedArticles();
});

const prisma = new PrismaService();

Given('there are no articles', async () => {
  await prisma.article.deleteMany();
});

Given('two articles share a publication timestamp', async () => {
  await prisma.article.deleteMany();

  const publishedAt = new Date('2026-05-01T12:00:00.000Z');

  await prisma.article.createMany({
    data: [
      {
        id: '5e1f0a2b-0001-4000-8000-000000000011',
        title: 'Second article',
        text: 'The second article.',
        publishedAt,
      },
      {
        id: '5e1f0a2b-0001-4000-8000-000000000010',
        title: 'First article',
        text: 'The first article.',
        publishedAt,
      },
    ],
  });
});

Then('the response should contain an empty list', () => {
  expect(apiResponse.data).toEqual([]);
});

Then('the articles should be ordered newest first', () => {
  expect(apiResponse.data).toHaveLength(3);

  expect(apiResponse.data.map((article: { id: string }) => article.id)).toEqual(
    [
      '5e1f0a2b-0001-4000-8000-000000000003',
      '5e1f0a2b-0001-4000-8000-000000000002',
      '5e1f0a2b-0001-4000-8000-000000000001',
    ],
  );
});

Then('the articles should have a deterministic order', async () => {
  const firstOrder = apiResponse.data.map(
    (article: { id: string }) => article.id,
  );

  for (let i = 0; i < 4; i++) {
    const response = await axios.get(`${apiBaseUrl}/api/v1/articles`);

    expect(response.data.map((article: { id: string }) => article.id)).toEqual(
      firstOrder,
    );
  }

  expect(firstOrder).toEqual([
    '5e1f0a2b-0001-4000-8000-000000000010',
    '5e1f0a2b-0001-4000-8000-000000000011',
  ]);
});

AfterAll(async () => {
  await prisma.$disconnect();
});

Given('I use admin token', async () => {
  apiToken = 'admin-token';
});

Given('I use destructive actions token', async () => {
  apiToken = 'destructive-actions-token';
});

When(
  'I send a {string} request to {string}',
  async (method: string, path: string) => {
    const url = `${apiBaseUrl}${path}`;
    apiResponse = await axios.request({
      method: method,
      url: url,
      validateStatus: () => true,
      headers: apiToken === '' ? {} : { Authorization: `Bearer ${apiToken}` },
    });
  },
);

When(
  'I send a {string} request to {string} with body:',
  async (method: string, path: string, body: string) => {
    const url = `${apiBaseUrl}${path}`;
    apiResponse = await axios.request({
      method: method,
      url: url,
      data: JSON.parse(body),
      validateStatus: () => true,
      headers: apiToken === '' ? {} : { Authorization: `Bearer ${apiToken}` },
    });
  },
);

When('I run the seed again', () => {
  execSync('npx prisma db seed', { stdio: 'inherit' });
});

Then(
  'the database should contain exactly {int} articles',
  async (count: number) => {
    await expect(await prisma.article.count()).toBe(count);
  },
);

Then('the response message should say the article was not found', () => {
  expect(apiResponse.data.message).toContain('Article');
  expect(apiResponse.data.message).toContain('was not found');
});

Then('the response status should be {int}', (statusCode: number) => {
  expect(apiResponse.status).toBe(statusCode);
});

Then(
  'the response body should have the property {string}',
  (property: string) => {
    expect(apiResponse.data).toHaveProperty(property);
  },
);

Then('the response body should contain:', async function (docString: string) {
  const expected = JSON.parse(docString);
  const actual = apiResponse.data;

  deepCompare(actual, expected);
});

Then('I dump response', () => {
  console.log(JSON.stringify(apiResponse.data));
});

After(() => {
  apiToken = null;
});
