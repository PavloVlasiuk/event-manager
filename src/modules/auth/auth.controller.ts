import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDTO, TokensDTO } from './dtos';
import { LocalAuthGuard } from './security/guards/local-auth.guard';
import { JwtGuard } from './security/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegistrationDTO): Promise<TokensDTO> {
    return await this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<TokensDTO> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtGuard)
  @Post('refresh')
  async refresh(@Request() req): Promise<{ accessToken: string }> {
    const refreshToken = req.headers.authorization.split(' ')[1];

    return this.authService.refresh(req.user, refreshToken);
  }
}
