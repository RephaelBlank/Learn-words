import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class TaskAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.query.authToken; 
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const payload = this.jwtService.verify(token, { secret: jwtConstants.secret });
      console.log(payload); 
      request['taskId'] = payload.assignedID;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
