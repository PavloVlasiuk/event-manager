import { HttpException, HttpStatus } from '@nestjs/common';

export class IdenticalPasswordException extends HttpException {
  constructor() {
    super('New and old passwords must be different', HttpStatus.BAD_REQUEST);
  }
}