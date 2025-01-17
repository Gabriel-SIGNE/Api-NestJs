import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './models/User';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { jwtStrategy } from './jwt.strategy';

@Module({
  imports:[
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }
    }),
    MongooseModule.forFeature([{name: User.name, schema: userSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService, jwtStrategy],
  exports: [jwtStrategy, PassportModule],  
})
export class AuthModule {}
