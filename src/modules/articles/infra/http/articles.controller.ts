import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
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

@ApiTags('articles')
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(
    private readonly listArticlesHandler: ListArticlesHandler,
    private readonly getArticleHandler: GetArticleHandler,
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
}
