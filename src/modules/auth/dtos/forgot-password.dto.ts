import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { validationOptionsMsg } from 'src/common/utils';

export class ForgotPasswordDTO {
  @ApiProperty({
    description: 'Email used for registration',
  })
  @IsEmail({}, validationOptionsMsg('Email must be an email address'))
  @IsNotEmpty(validationOptionsMsg('Email cannot be empty'))
    email: string;
}