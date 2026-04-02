import { Body, Controller, Query, Sse } from '@nestjs/common';
import { TemporaryChatDto } from './chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Sse('temporary-chat')
  temporaryChat(@Query('prompt') prompt: string) {
    return this.chatService.temporaryChatStream(prompt);
  }
}
