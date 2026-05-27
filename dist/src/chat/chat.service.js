"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
const rxjs_1 = require("rxjs");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
let ChatService = class ChatService {
    genAI;
    constructor() {
        this.genAI = ai;
    }
    temporaryChatStream(body) {
        return new rxjs_1.Observable((subscriber) => {
            const streamFromGemini = async () => {
                const { prompt, history } = body;
                console.log(body);
                try {
                    const contents = [
                        ...history,
                        { role: 'user', parts: [{ text: prompt }] },
                    ];
                    const result = await this.genAI.models.generateContentStream({
                        model: 'gemma-4-26b-a4b-it',
                        contents: contents,
                    });
                    for await (const chunk of result) {
                        const text = chunk.text;
                        if (text)
                            subscriber.next({ data: { text } });
                    }
                    subscriber.next({ data: { done: true } });
                    subscriber.complete();
                }
                catch (error) {
                    console.error('Error communicating with Gemini:', error);
                    subscriber.error(error);
                }
                finally {
                    subscriber.complete();
                }
            };
            void streamFromGemini();
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ChatService);
//# sourceMappingURL=chat.service.js.map