import { IsArray, IsOptional, IsString } from 'class-validator';

export class TemporaryChatDto {
  @IsString()
  prompt: string;

  @IsArray()
  @IsOptional()
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export class TemporaryChaResponseDto {
  @IsString()
  response: string;
}
