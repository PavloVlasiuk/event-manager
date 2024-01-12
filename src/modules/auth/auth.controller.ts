import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegistrationDTO } from './dtos';
import { LocalAuthGuard } from './security/guards/local-auth.guard';
import { JwtGuard } from './security/guards/jwt.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenResponse, TokensResponse } from './responses';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: `
      Username must be a string
      Username cannot be empty
      Email cannot be empty
      Password cannot be null
      User is already registered`,
  })
  @ApiOperation({
    summary: 'Register new user',
  })
  @Post('register')
  async register(@Body() body: RegistrationDTO): Promise<void> {
    return await this.authService.register(body);
  }

  @ApiCreatedResponse({
    type: TokensResponse,
  })
  @ApiBadRequestResponse({
    description: `
      Email verification token is invalid`,
  })
  @ApiParam({
    name: 'token',
    type: String,
    required: true,
    description: 'Email verification token',
  })
  @ApiOperation({
    summary: 'Verify email address',
  })
  @Post('verify/:token')
  async verify(@Param('token') token: string): Promise<TokensResponse> {
    return await this.authService.verify(token);
  }

  @ApiCreatedResponse({
    type: TokensResponse,
  })
  @ApiBadRequestResponse({
    description: `
      User with such id is not found`,
  })
  @ApiUnauthorizedResponse({
    description: `
      Invalid password
      Email address is not verified yet`,
  })
  @ApiBody({
    type: LoginDTO,
  })
  @ApiOperation({
    summary: 'Log in the application',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<TokensResponse> {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: AccessTokenResponse,
  })
  @ApiUnauthorizedResponse({
    description: `
      Unauthorized
      Invalid refresh token`,
  })
  @ApiOperation({
    summary: 'Get new access token in exchange for refresh token',
  })
  @UseGuards(JwtGuard)
  @Post('refresh')
  async refresh(@Request() req): Promise<AccessTokenResponse> {
    const refreshToken = req.headers.authorization.split(' ')[1];

    return this.authService.refresh(req.user, refreshToken);
  }
}
