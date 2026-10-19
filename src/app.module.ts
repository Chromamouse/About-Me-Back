import { Module } from '@nestjs/common';
import { StatusController } from 'src/modules/status/status.controller';
import { ArticlesModule } from './modules/articles/articles.module';

@Module({
  imports: [ArticlesModule],
  controllers: [StatusController],
})
export class AppModule {}
