import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async creteUser(): Promise<any> {
    return 'create User';
  }
}
