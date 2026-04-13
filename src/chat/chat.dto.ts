import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TemporaryChatDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  prompt: string;

  @IsArray()
  @IsOptional()
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export class TemporaryChaResponseDto {
  @IsString()
  response: string;
}
