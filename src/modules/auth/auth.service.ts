import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegistrationDTO, TokensDTO } from './dtos';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/database/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AlreadyRegisteredException } from 'src/common/exceptions/AlreadyRegisteredException';
import { User } from '@prisma/client';
import { InvalidEntityIdException } from 'src/common/exceptions/InvalidEntityIdException';
import { JwtPayload } from './types/jwt-payload.type';
import { RefreshTokenRepository } from 'src/database/repositories/refresh-token.repository';
import { SecurityCongigService } from '../config/security-config.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private securityConfig: SecurityCongigService,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.find({ username });

    if (!user) {
      throw new InvalidEntityIdException('User');
    }

    const matchPassword = await this.checkPassword(password, user.passwordHash);

    if (!matchPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    delete user.passwordHash;

    return user;
  }

  async register({
    username,
    email,
    password,
  }: RegistrationDTO): Promise<TokensDTO> {
    if (await this.isRegistered(username, email)) {
      throw new AlreadyRegisteredException();
    }

    const passwordHash = await this.hashPassword(password);

    const data = { username, email, passwordHash };
    const user = await this.userRepository.create(data);

    const tokens = this.getTokens(user);
    await this.refreshTokenRepository.create({
      userId: user.id,
      token: tokens.refreshToken,
    });

    return tokens;
  }

  async login(user: User): Promise<TokensDTO> {
    const tokens = this.getTokens(user);

    await this.refreshTokenRepository.updateByUserId(
      user.id,
      tokens.refreshToken,
    );

    return tokens;
  }

  async refresh(
    user: User,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const token = await this.refreshTokenRepository.findByUserId(user.id);
    if (!token) {
      throw new UnauthorizedException();
    }

    if (refreshToken !== token.token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.getAccessToken(user);
  }

  private async isRegistered(
    username: string,
    email: string,
  ): Promise<boolean> {
    const user = await this.userRepository.find({
      OR: [{ username }, { email }],
    });

    return !!user;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);
  }

  private getAccessToken(user: User): { accessToken: string } {
    const payload = this.createPayload(user);

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.securityConfig.jwtTtl,
      secret: this.securityConfig.secret,
    });

    return {
      accessToken,
    };
  }

  private getTokens(user: User): TokensDTO {
    const payload = this.createPayload(user);

    const secret = this.securityConfig.secret;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.securityConfig.jwtTtl,
      secret,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.securityConfig.jwtRefreshTtl,
      secret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async checkPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private createPayload(user: User): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
    };
  }
}
