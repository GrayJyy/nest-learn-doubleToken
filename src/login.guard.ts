import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const _request: Request = context.switchToHttp().getRequest();
    const _authorization = _request.headers.authorization;
    if (!_authorization) throw new UnauthorizedException('用户未登录');
    const _token = _request.headers.authorization.split(' ')[1];
    try {
      this.jwtService.verify(_token);
      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
