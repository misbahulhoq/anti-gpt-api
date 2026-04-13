import { Body, Controller, Sse } from '@nestjs/common';
import { TemporaryChatDto } from './chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Sse('temporary-chat')
  temporaryChat(@Body() temporaryChatDto: TemporaryChatDto) {
    const { prompt } = temporaryChatDto;
    return this.chatService.temporaryChatStream(prompt);
  }
}
