import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarksService {
  constructor(private readonly prismaService: PrismaService) {}

  getBookmarks(userId: string) {
    return this.prismaService.bookmarks.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmarkById(userId: string, bookmarkId: string) {
    return this.prismaService.bookmarks.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(userId: string, createBookmarkDto: CreateBookmarkDto) {
    const bookmark = await this.prismaService.bookmarks.create({
      data: {
        userId,
        ...createBookmarkDto,
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userId: string,
    bookmarkId: string,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    // TODO: get bookmark by id
    const bookmark = await this.prismaService.bookmarks.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    // TODO: check user own this bookmark
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access the resource denied');
    }
    // TODO: update this bookmark
    return this.prismaService.bookmarks.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...updateBookmarkDto,
      },
    });
  }

  async deleteBookmarkById(userId: string, bookmarkId: string) {
    // TODO: find bookmark by id
    const bookmark = await this.prismaService.bookmarks.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    // TODO: check user own this bookmark?
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }
    // TODO: delete this bookmark
    await this.prismaService.bookmarks.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
