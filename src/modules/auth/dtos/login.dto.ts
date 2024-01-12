import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: 'Existing user\'s username in the application',
  })
    username: string;
  @ApiProperty({
    description: 'User\'s password to the application',
  })
    password: string;
}
