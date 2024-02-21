import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { validationOptionsMsg } from 'src/common/utils';

export class CategoryDTO {
  @ApiProperty()
  @IsString(validationOptionsMsg('Category name must be a string'))
  @MaxLength(30, validationOptionsMsg('Category name must contain a maximum of 9 characters'))
  @IsNotEmpty(validationOptionsMsg('Category name cannot be empty'))
    name: string;

  @ApiPropertyOptional()
  @MaxLength(1000, validationOptionsMsg('Category description must contain a maximum of 1000 characters'))
  @IsOptional()
    description?: string; 
}