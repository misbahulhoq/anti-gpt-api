import { Body, Controller, Post, Sse } from '@nestjs/common';
import { TemporaryChatDto } from './chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('temporary-chat')
  @Sse()
  // @HttpStatus.OK
  temporaryChat(@Body() temporaryChatDto: TemporaryChatDto) {
    const { prompt, history } = temporaryChatDto;
    return this.chatService.temporaryChatStream({ prompt, history });
  }
}
