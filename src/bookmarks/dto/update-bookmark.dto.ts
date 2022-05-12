// import { PartialType } from '@nestjs/mapped-types';
// import { CreateBookmarkDto } from './create-bookmark.dto';

// export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBookmarkDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  link?: string;
}
