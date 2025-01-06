import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClassesModule } from 'src/classes/classes.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { PerformanceModule } from 'src/performance/performance.module';


@Module({
  imports: [forwardRef(()=>ClassesModule),forwardRef(()=>PerformanceModule),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
