import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { BookmarksService } from './bookmarks.service';

import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: string) {
    return this.bookmarksService.getBookmarks(userId);
  }

  @Get(':bookmarkId')
  getBookmarkById(
    @GetUser('id') userId: string,
    @Param('bookmarkId') bookmarkId: string,
  ) {
    return this.bookmarksService.getBookmarkById(userId, bookmarkId);
  }

  @Post()
  createBookmark(
    @GetUser('id') userId: string,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.createBookmark(userId, createBookmarkDto);
  }

  @Patch(':bookmarkId')
  editBookmarkById(
    @GetUser('id') userId: string,
    @Param('bookmarkId') bookmarkId: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.editBookmarkById(
      userId,
      bookmarkId,
      updateBookmarkDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':bookmarkId')
  deleteBookmarkById(
    @GetUser('id') userId: string,
    @Param('bookmarkId') bookmarkId: string,
  ) {
    return this.bookmarksService.deleteBookmarkById(userId, bookmarkId);
  }
}
