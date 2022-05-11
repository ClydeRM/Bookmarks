import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
// Hash PWD
import * as argon from 'argon2';

import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signup(authDto: AuthDto) {
    // generate the PWD hash
    const hash = await argon.hash(authDto.password);
    // save the new user in the db
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          hash,
        },
      });
      // return the JWT token
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // CODE P2002 表示 Unique 資料欄位資料重複
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(authDto: AuthDto) {
    // find User by email
    // findUnique() find element in UniqueField // findFirst() find element in AnyField
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    // if user not found, throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // compare password
    // argon2.verify(HashedPWD, UnHashPWD)
    const pwdMatches = await argon.verify(user.hash, authDto.password);
    // if password is incorrect, throw exception
    if (!pwdMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // send back user
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId, // sub: is JWT identifier
      email,
    };
    const secret = this.configService.get('jwt.secret');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m', // after 15 mins, Token expired
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
