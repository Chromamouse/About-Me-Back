import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StatusController } from 'src/modules/status/status.controller';
import { ArticlesModule } from './modules/articles/articles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ArticlesModule,
  ],
  controllers: [StatusController],
})
export class AppModule {}
