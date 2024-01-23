import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { validationOptionsMsg } from 'src/common/utils';

export class CreatePermissionDTO {
  @ApiProperty({
    description: 'Name of the role',
  })
  @IsString(validationOptionsMsg('Name must be a string'))
  @IsNotEmpty(validationOptionsMsg('Name cannot be empty'))
    action: string;
}