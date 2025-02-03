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
      console.log (request.body);

      if (user && user.role === 'admin'){
        return true; 
      }
  
      if (!user || !user.sub) {
        throw new ForbiddenException('Access denied');
      }
      
      const resourceType = this.extractResourceType(request);
      const resourceOwnerId = this.extractResourceId(request, resourceType);
      console.log (resourceType); 
      console.log(resourceOwnerId);

      if (user && user.role === 'teacher'){
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

      //user is student
      const isAuthorized = await this.authService.validateAccessStudent(
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
      console.log (request.query); 
      if (request.query?.studentID||request.params?.studentID){
          return 'student'; 
        }
        if (request.params?.executionID){
          return 'execution'; 
        }
        if (request.params?.assignedID){
          return 'assignedTask'; 
        }
        return request.body?.resourceType || 'class'; 
    }
  
    private extractResourceId(request: any, resourceType: string): number {
        switch (resourceType){
            case 'class':
                return request.params?.id ||request.body?.classID|| 0; 
            case 'assignedTask':
                return request.body?.taskID ||request.params?.assignedID || 0; 
            case 'teacher': 
                return request.body?.teacherID || 0;
            case 'student':
                return request.query?.studentID || request.params?.studentID || 0;
            case 'execution':
                return request.params?.executionID || 0; 
            default:
                return 0;
        } 
    }
  }
  