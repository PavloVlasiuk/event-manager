import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX, USERNAME_REGEX } from 'src/common/constants';
import { validationOptionsMsg } from 'src/common/utils';

export class RegistrationDTO {
  @ApiProperty({
    description: 'User\'s username in the application',
  })
  @IsString(validationOptionsMsg('Username must be a string'))
  @Matches(
    USERNAME_REGEX,
    validationOptionsMsg(
      'Username must contain from 2 to 30 characters, include only latin letters, numbers and \'_-\' characters',
    ),
  )
  @IsNotEmpty(validationOptionsMsg('Username cannot be empty'))
    username: string;

  @ApiProperty({
    description: 'User\'s email in the application',
  })
  @IsEmail({}, validationOptionsMsg('Email must be an email address'))
  @IsNotEmpty(validationOptionsMsg('Email cannot be empty'))
    email: string;

  @ApiProperty({
    description: 'User\'s password to access the application',
  })
  @IsString(validationOptionsMsg('Password must be a string'))
  @Matches(
    PASSWORD_REGEX,
    validationOptionsMsg(
      'Password must contain from 8 to 32 characters, include at least 1 letter and 1 number',
    ),
  )
  @IsNotEmpty(validationOptionsMsg('Password cannot be empty'))
    password: string;
}
