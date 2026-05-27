import { Content } from '@google/genai';
import { Observable } from 'rxjs';
export declare class ChatService {
    private readonly genAI;
    constructor();
    temporaryChatStream(body: {
        prompt: string;
        history: Content[];
    }): Observable<unknown>;
}
