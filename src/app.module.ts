import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { PrismaModule } from './prisma/prisma.module';

import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    AuthModule,
    UserModule,
    BookmarksModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
