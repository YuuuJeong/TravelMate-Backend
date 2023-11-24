import { Controller, Get } from '@nestjs/common';
import { ChatBookmarkCollectionService } from './chat-bookmark-collection.service';

@Controller()
export class ChatBookmarkCollectionController {
  constructor(
    private readonly chatBookmarkCollectionService: ChatBookmarkCollectionService,
  ) {}

  @Get()
  getHello(): string {
    return this.chatBookmarkCollectionService.getHello();
  }
}
