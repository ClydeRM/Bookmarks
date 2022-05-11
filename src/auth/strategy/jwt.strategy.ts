import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
// 每個Strategy class都要繼承 PassportStrategy class 並傳入實作種類的參數，這邊是jwt的strategy
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 取出 bearer _Token_
      ignoreExpiration: false, // 忽略Expiration時間資料，預設本來就是false
      secretOrKey: configService.get('jwt.secret'), // 開發者設定的secret，在.env中
    });
  }
  // Req.header.Authorization 被解析成物件payload傳入 validate()
  async validate(payload: { sub: string; email: string }) {
    // Use payload compare to DB user credentials
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        // Return field
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        firstName: true,
        lastName: true,
        bookmarks: true,
      },
    });
    // Append the payload obj to the Route request.user
    // if return null, Get exception "401 UnAuthorization""
    return user;
  }
}
