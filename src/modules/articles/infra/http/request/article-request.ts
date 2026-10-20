import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class CreateArticleRequest {
  @ApiProperty({ minLength: 3, maxLength: 120 })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title: string;

  @ApiProperty({ minLength: 1, maxLength: 20000 })
  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  text: string;
}

export class UpdateArticleRequest {
  @ApiPropertyOptional({ minLength: 3, maxLength: 120 })
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({ minLength: 1, maxLength: 20000 })
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  text?: string;
}
