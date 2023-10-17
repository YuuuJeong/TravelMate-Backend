import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookmarkService } from './bookmark.service';

@Controller('')
@ApiTags('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}
}
