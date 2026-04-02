import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { Observable } from 'rxjs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

@Injectable()
export class ChatService {
  private readonly genAI: GoogleGenAI;
  constructor() {
    this.genAI = ai;
  }

  temporaryChatStream(prompt: string) {
    return new Observable((subscriber) => {
      (async () => {
        try {
          const result = await this.genAI.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });
          for await (const chunk of result) {
            const text = chunk.text;
            if (text) subscriber.next({ data: { text } });
          }
          subscriber.next({ data: { done: true } });
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }

  async *tempChatStream(prompt: string): AsyncGenerator<string, void, unknown> {
    try {
      const result = await this.genAI.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      for await (const chunk of result) {
        const text = chunk.text;
        if (text) yield text;
      }
    } catch (error) {
      console.error('Error communicating with Gemini:', error);
      throw new InternalServerErrorException(
        'Failed to generate response stream',
      );
    }
  }

  async temporaryChat() {}
}
