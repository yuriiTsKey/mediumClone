import { Controller, Get } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  @Get('user')
  async getUserProfile(): Promise<any> {
    return 'Yuzik';
  }
}
