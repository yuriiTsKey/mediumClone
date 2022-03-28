import { Body, Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<any> {
    return this.userService.creteUser(createUserDto);
  }
}
