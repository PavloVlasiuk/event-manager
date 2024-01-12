import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { validationOptionsMsg } from 'src/common/validationOptionsMsg';

export class RegistrationDTO {
  @ApiProperty({
    description: 'User\'s username in the application',
  })
  @IsString(validationOptionsMsg('Username must be a string'))
  @IsNotEmpty(validationOptionsMsg('Username cannot be empty'))
    username: string;

  @ApiProperty({
    description: 'User\'s email in the application',
  })
  @IsEmail()
  @IsNotEmpty(validationOptionsMsg('Email cannot be empty'))
    email: string;

  @ApiProperty({
    description: 'User\'s password to access the application',
  })
  @IsString()
  @IsNotEmpty(validationOptionsMsg('Password cannot be null'))
    password: string;
}
