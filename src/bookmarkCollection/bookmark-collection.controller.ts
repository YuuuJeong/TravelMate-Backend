import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookmarkCollectionService } from './bookmark-collection.service';

@Controller('')
@ApiTags('bookmark-collection')
export class BookmarkCollectionController {
  constructor(
    private readonly bookmarkCollectionService: BookmarkCollectionService,
  ) {}
}
