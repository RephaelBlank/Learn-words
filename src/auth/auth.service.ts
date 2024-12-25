import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClasseService } from 'src/classes/classes.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        private classesService: ClasseService,
        private jwtService: JwtService
    ) {}

  async signIn(teacherID: number, pass: string): Promise<any> {
    const user = await this.classesService.findTeacherById(teacherID);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.teacherID, username: user.teacherName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
