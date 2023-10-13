import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async login({ username, password }: LoginDto) {
    const _foundedUser = await this.entityManager.findOne(User, {
      where: { username },
    });
    if (!_foundedUser) throw new HttpException('用户名不存在', HttpStatus.OK);
    if (_foundedUser.password !== password)
      throw new HttpException('密码错误', HttpStatus.OK);
    return _foundedUser;
  }

  async findUserById(userId: number) {
    const _user = await this.entityManager.findOneBy(User, { id: userId });
    return _user;
  }

  async getToken(user: User) {
    const _access_token = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      { expiresIn: '30m' },
    );

    const _refresh_token = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn: '7d',
      },
    );
    return {
      access_token: _access_token,
      refresh_token: _refresh_token,
    };
  }
}
