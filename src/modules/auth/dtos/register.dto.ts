import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { validationOptionsMsg } from 'src/common/validationOptionsMsg';

export class RegistrationDTO {
  @IsString(validationOptionsMsg('Username must be a string'))
  @IsNotEmpty(validationOptionsMsg('Username cannot be empty'))
  username: string;

  @IsEmail()
  @IsNotEmpty(validationOptionsMsg('Email cannot be empty'))
  email: string;

  @IsString()
  @IsNotEmpty(validationOptionsMsg('Password cannot be null'))
  password: string;
}
