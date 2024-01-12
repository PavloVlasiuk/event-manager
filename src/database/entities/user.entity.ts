import { State } from '@prisma/client';

export class UserEntity {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  state: State;
}
