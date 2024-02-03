import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard, JwtGuard } from '../../security/guards';
import { AccessTokenResponse, TokensResponse } from './responses';
import {
  ForgotPasswordDTO,
  LoginDTO,
  RegistrationDTO,
  UpdatePasswordDTO,
  ResetPasswordDTO,
} from './dtos';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: `
      Username must be a string
      Username must contain from 2 to 30 characters, include only latin letters, numbers and \'_-\' characters
      Username cannot be empty
      Email must be an email address
      Email cannot be empty
      Password must be a string
      Password must contain from 8 to 32 characters, include at least 1 letter and 1 number
      Password cannot be empty
      User is already registered
      `,
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

  @ApiBearerAuth()
  @ApiOkResponse({
    type: TokensResponse,
  })
  @ApiBadRequestResponse({
    description: `
      Password must be a string
      Password must contain from 8 to 32 characters, include at least 1 letter and 1 number
      Password cannot be empty
      New and old passwords must be different`,
  })
  @ApiUnauthorizedResponse({
    description: `
      Unauthorized`,
  })
  @ApiOperation({
    summary: 'Set new password to the account using old password',
  })
  @UseGuards(JwtGuard)
  @Post('updatePassword')
  async updatePassword(@Body() body: UpdatePasswordDTO, @Request() req): Promise<TokensResponse> {
    return this.authService.updatePassword(body, req.user.id);
  }

  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: `
      Email must be an email address
      Email cannot be empty
      User is not registered`,
  })
  @ApiOperation({
    summary: 'Send a link to email address to create new password',
  })
  @Post('forgotPassword')
  async forgotPassword(@Body() body: ForgotPasswordDTO): Promise<void> {
    return this.authService.forgotPassword(body.email);
  }

  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: `
      Password must be a string
      Password must contain from 8 to 32 characters, include at least 1 letter and 1 number
      Password cannot be empty
      Email verification token is invalid`,
  })
  @ApiParam({
    name: 'token',
    type: String,
    required: true,
    description: 'Email verification token',
  })
  @ApiOperation({
    summary: 'Reset old password and set new password',
  })
  @Post('resetPassword/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() body: ResetPasswordDTO,
  ): Promise<void> {
    return this.authService.resetPassword(token, body.password);
  }
}
