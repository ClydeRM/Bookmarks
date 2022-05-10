import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
// 每個Strategy class都要繼承 PassportStrategy class 並傳入實作種類的參數，這邊是jwt的strategy
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 取出 bearer _Token_
      ignoreExpiration: false, // 忽略Expiration時間資料，預設本來就是false
      secretOrKey: configService.get('jwt.secret'), // 開發者設定的secret，在.env中
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
