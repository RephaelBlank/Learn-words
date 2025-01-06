import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
import { AuthService } from './auth.service';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor (private readonly authService: AuthService){} 

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request['user']; 
      console.log (user); 

      if (user && user.role === 'admin'){
        return true; 
      }
  
      if (!user || !user.sub) {
        throw new ForbiddenException('Access denied');
      }
      
      const resourceType = this.extractResourceType(request);
      const resourceOwnerId = this.extractResourceId(request, resourceType);

      console.log(resourceOwnerId);
      const isAuthorized = await this.authService.validateAccessTeacher(
        user.sub,
        resourceType,
        resourceOwnerId
      );
  
      if (!isAuthorized) {
        throw new ForbiddenException('You do not have access to this resource');
      }
      
      return true;
    }

    private extractResourceType (request: any): string{
        return request.body?.resourceType || ''; 
    }
  
    private extractResourceId(request: any, resourceType: string): number {
        switch (resourceType){
            case 'class':
                return request.body?.classID || 0; 
            case 'assignedTask':
                return request.body?.taskID || 0; 
            case 'teacher': 
                return request.body?.teacherID || 0; 
            default:
                return 0;
        } 
    }
  }
  