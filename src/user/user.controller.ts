import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { UserService } from './user.service';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

import { EditUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  getme(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editme(@GetUser('id') userId: string, @Body() editUserDto: EditUserDto) {
    return this.userService.editUser(userId, editUserDto);
  }
}
