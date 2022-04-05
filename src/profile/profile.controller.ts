import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('user:userid')
  async getUserProfile(@Param('userid') userid: number): Promise<any> {
    return this.profileService.getProfile(userid);
  }
}
