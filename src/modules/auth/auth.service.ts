import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegistrationDTO } from './dtos';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/database/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AlreadyRegisteredException } from 'src/utils/exceptions/AlreadyRegisteredException';
import { User } from '@prisma/client';
import { InvalidEntityIdException } from 'src/utils/exceptions/InvalidEntityIdException';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  private async isRegistered(
    username: string,
    email: string,
  ): Promise<boolean> {
    const user = await this.userRepository.find({
      OR: [{ username }, { email }],
    });

    return !!user;
  }

  async register(
    registrationDTO: RegistrationDTO,
  ): Promise<{ access_token: string }> {
    const { username, email, password } = registrationDTO;

    if (await this.isRegistered(username, email)) {
      throw new AlreadyRegisteredException();
    }

    const passwordHash = await this.hashPassword(password);
    const data = { username, email, passwordHash };

    const user = await this.userRepository.create(data);

    return await this.getAccessToken(user.id, user.email);
  }

  async login(user: User) {
    return this.getAccessToken(user.id, user.email);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);
  }

  private getAccessToken(
    userId: string,
    email: string,
  ): { access_token: string } {
    const payload = {
      sub: userId,
      email,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.find({ username });

    if (!user) {
      throw new InvalidEntityIdException('User');
    }

    const matchPassword = await this.validatePassword(
      password,
      user.passwordHash,
    );

    if (!matchPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    delete user.passwordHash;

    return user;
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
