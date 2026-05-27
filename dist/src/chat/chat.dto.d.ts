export declare class TemporaryChatDto {
    prompt: string;
    history: {
        role: 'user' | 'model';
        content: string;
    }[];
}
export declare class TemporaryChaResponseDto {
    response: string;
}
