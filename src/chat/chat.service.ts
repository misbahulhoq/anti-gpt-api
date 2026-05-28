import { Injectable } from '@nestjs/common';
import { GoogleGenAI, Content } from '@google/genai';
import { Observable } from 'rxjs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

@Injectable()
export class ChatService {
  private readonly genAI: GoogleGenAI;
  constructor() {
    this.genAI = ai;
  }

  temporaryChatStream(body: { prompt: string; history: Content[] }) {
    return new Observable((subscriber) => {
      const streamFromGemini = async () => {
        const { prompt, history } = body;

        try {
          const contents: Content[] = [
            ...history,
            { role: 'user', parts: [{ text: prompt }] },
          ];

          // const result = await chat.sendMessageStream({ message: prompt });
          const result = await this.genAI.models.generateContentStream({
            // model: 'gemini-2.5-flash',
            model: 'gemma-4-26b-a4b-it',
            contents: contents,
          });
          for await (const chunk of result) {
            const text = chunk.text;
            if (text) subscriber.next({ data: { text } });
          }
          subscriber.next({ data: { done: true } });
          subscriber.complete();
        } catch (error) {
          console.error('Error communicating with Gemini:', error);
          subscriber.error(error);
        } finally {
          subscriber.complete();
        }
      };
      void streamFromGemini();
    });
  }
}
