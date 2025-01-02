import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request['user']; 
      console.log (user); 
  
      if (!user || !user.sub) {
        throw new ForbiddenException('Access denied');
      }
  
      const resourceOwnerId = this.extractResourceOwnerId(request);
      console.log(resourceOwnerId);
      if (user.sub !== resourceOwnerId) {
        throw new ForbiddenException('You do not have access to this resource');
      }
  
      return true;
    }
  
    private extractResourceOwnerId(request: any): string {
        console.log (request); 
        return request.body?.teacherID || ''; 
    }
  }
  