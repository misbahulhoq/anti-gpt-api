import { TemporaryChatDto } from './chat.dto';
import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    temporaryChat(temporaryChatDto: TemporaryChatDto): import("rxjs").Observable<unknown>;
}
