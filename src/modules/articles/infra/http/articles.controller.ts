import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../../../../core/http/auth/admin.guard';
import { CreateArticleCommand } from '../../application/commands/create-article.command';
import { CreateArticleRequest } from './request/article-request';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetArticleHandler } from '../../application/queries/get-article.handler';
import { GetArticleQuery } from '../../application/queries/get-article.query';
import { ListArticlesHandler } from '../../application/queries/list-articles.handler';
import { ArticleResponseDto } from './dto/article-response.dto';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { UpdateArticleCommand } from '../../application/commands/update-article.command';
import { DeleteArticleCommand } from '../../application/commands/delete-article.command';
import { UpdateArticleRequest } from './request/article-request';

@ApiTags('articles')
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(
    private readonly listArticlesHandler: ListArticlesHandler,
    private readonly getArticleHandler: GetArticleHandler,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List articles, newest first' })
  @ApiOkResponse({
    description: 'The list of articles',
    type: ArticleResponseDto,
    isArray: true,
  })
  listArticles(): Promise<ArticleResponseDto[]> {
    return this.listArticlesHandler.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an article by ID' })
  @ApiParam({
    name: 'id',
    description: 'The article UUID',
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'The requested article',
    type: ArticleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'The supplied ID is not a valid UUID v4',
  })
  @ApiNotFoundResponse({
    description: 'No article exists with the supplied ID',
  })
  getArticle(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ArticleResponseDto> {
    return this.getArticleHandler.execute(new GetArticleQuery(id));
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create an article (admin only)' })
  @ApiCreatedResponse({
    description: 'The article was created',
    type: ArticleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'The request contains invalid fields',
  })
  @ApiUnauthorizedResponse({
    description: 'The admin token is missing',
  })
  @ApiForbiddenResponse({
    description: 'The admin token is incorrect',
  })
  createArticle(
    @Body() request: CreateArticleRequest,
  ): Promise<ArticleResponseDto> {
    return this.commandBus.execute(
      new CreateArticleCommand(request.title, request.text),
    );
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an article (admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The article UUID',
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'The article was updated',
    type: ArticleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'The ID or request body is invalid',
  })
  @ApiUnauthorizedResponse({
    description: 'The admin token is missing',
  })
  @ApiForbiddenResponse({
    description: 'The admin token is incorrect',
  })
  @ApiNotFoundResponse({
    description: 'No article exists with the supplied ID',
  })
  async updateArticle(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() request: UpdateArticleRequest,
  ): Promise<ArticleResponseDto> {
    if (request.title === undefined && request.text === undefined) {
      throw new BadRequestException(
        'At least one of title or text must be provided',
      );
    }

    return this.commandBus.execute(
      new UpdateArticleCommand(id, request.title, request.text),
    );
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an article (admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The article UUID',
    format: 'uuid',
  })
  @ApiNoContentResponse({
    description: 'The article was deleted',
  })
  @ApiBadRequestResponse({
    description: 'The supplied ID is not a valid UUID v4',
  })
  @ApiUnauthorizedResponse({
    description: 'The admin token is missing',
  })
  @ApiForbiddenResponse({
    description: 'The admin token is incorrect',
  })
  @ApiNotFoundResponse({
    description: 'No article exists with the supplied ID',
  })
  async deleteArticle(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteArticleCommand(id));
  }
}
