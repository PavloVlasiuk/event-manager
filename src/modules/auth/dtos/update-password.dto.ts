import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { validationOptionsMsg } from 'src/common/validationOptionsMsg';

export class UpdatePasswordDTO {
  @ApiProperty({
    description: 'Old password to the account',
  })
  @IsString()
  @IsNotEmpty(validationOptionsMsg('Password cannot be empty'))
    oldPassword: string;

  @ApiProperty({
    description: 'New password to the account',
  })
  @IsString()
  @IsNotEmpty(validationOptionsMsg('Password cannot be empty'))
    newPassword: string;
}