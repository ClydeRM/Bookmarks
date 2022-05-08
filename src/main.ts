import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 限制request，只傳入DTO規定的內容
      transform: true, // 自動轉換 request Body, 將Body的型別成DTO的類別物件
      forbidNonWhitelisted: true, // 抵擋request，如果request body有DTO規定外的欄位，request被攔截
      transformOptions: {
        enableImplicitConversion: true, // 不需要在額外標示@Type， ValidationPipe會依據原設定資料型態去驗證
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
