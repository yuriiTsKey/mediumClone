if(!process.env.IS_TS_NODE){
  require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = 5001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log(`Server run on port:${port}`);
}
bootstrap();
