import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileType } from './types/profile.type';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getProfile(userProfileName: string): Promise<ProfileType> {
    const userProfile = await this.userRepository.findOne({
      username: userProfileName,
    });
    if (!userProfile) {
      throw new HttpException(
        'This is not correct profile url',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { ...userProfile, following: false };
  }

  buildProfileResponse(profile) {
    delete profile.email;
    return { profile };
  }
}
