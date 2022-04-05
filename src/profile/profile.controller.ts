import { UserDecorator } from '@app/user/decorators/user.decorator';
import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './types/profileRespone.interface';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getUserProfile(
    @UserDecorator('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(profileUsername);
    return this.profileService.buildProfileResponse(profile);
  }
}
