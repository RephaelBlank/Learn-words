import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
  imports: [ClassesModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
