import {
  Body,
  Controller,
  Inject,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const _foundedUser = await this.userService.login(loginDto);
    return await this.userService.getToken(_foundedUser);
  }

  @Post('refresh')
  async refresh(@Query('refresh_token') refresh_token: string) {
    try {
      const _data = this.jwtService.verify(refresh_token);
      const _user = await this.userService.findUserById(_data.userId);
      return await this.userService.getToken(_user);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
}
