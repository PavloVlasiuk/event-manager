import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidEmailTokenException extends HttpException {
  constructor() {
    super('Email verification token is invalid', HttpStatus.BAD_REQUEST);
  }
}
