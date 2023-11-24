import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatBookmarkCollectionService {
  getHello(): string {
    return 'Hello World!';
  }
}
