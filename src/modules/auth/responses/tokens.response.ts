import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponse {
  @ApiProperty({
    description: 'Token to authenticate user',
  })
    accessToken: string;
}

export class TokensResponse extends AccessTokenResponse {
  @ApiProperty({
    description: 'Token to get new access token',
  })
    refreshToken: string;
}
