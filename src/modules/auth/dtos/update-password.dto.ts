import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/common/constants';
import { validationOptionsMsg } from 'src/common/utils';

export class UpdatePasswordDTO {
  @ApiProperty({
    description: 'Old password to the account',
  })
  @IsString(validationOptionsMsg('Password must be a string'))
  @Matches(
    PASSWORD_REGEX,
    validationOptionsMsg(
      'Password must contain from 8 to 32 characters, include at least 1 letter and 1 number',
    ),
  )
  @IsNotEmpty(validationOptionsMsg('Password cannot be empty'))
    oldPassword: string;

  @ApiProperty({
    description: 'New password to the account',
  })
  @IsString(validationOptionsMsg('Password must be a string'))
  @Matches(
    PASSWORD_REGEX,
    validationOptionsMsg(
      'Password must contain from 8 to 32 characters, include at least 1 letter and 1 number',
    ),
  )
  @IsNotEmpty(validationOptionsMsg('Password cannot be empty'))
    newPassword: string;
}
