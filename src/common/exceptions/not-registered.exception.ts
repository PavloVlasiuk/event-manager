import { HttpException, HttpStatus } from '@nestjs/common';

export class NotRegisteredException extends HttpException {
  constructor() {
    super('User is not registered', HttpStatus.BAD_REQUEST);
  }
}