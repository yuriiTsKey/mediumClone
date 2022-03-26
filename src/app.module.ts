import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';

import ormconfig from '@app/ormconfig'

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TagModule, 
    ConfigModule.forRoot({
    isGlobal: true,
  })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}