// /src/common/guards/jwt-auth.guard.ts

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { Request } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtUtil: JwtUtil,
    private reflector: Reflector,
    private datasource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }


    try {
      const payload = await this.jwtUtil.validateToken(token)
      console.log(payload);
      // const user = 

      // console.log(user);
      // if (!user) {
      //   throw new BadRequestException(`User not found!!`);
      // }
      // request['user'] = user;
      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      } else {
        throw error;
      }
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
