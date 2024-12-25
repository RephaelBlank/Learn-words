import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClasseService } from 'src/classes/classes.service';

@Injectable()
export class AuthService {
  constructor(private classesService: ClasseService) {}

  async signIn(teacherID: number, pass: string): Promise<any> {
    const user = await this.classesService.findTeacherById(teacherID);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
}
