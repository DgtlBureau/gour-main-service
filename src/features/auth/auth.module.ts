import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../entity/Client';
import { ClientModule } from '../client/client.module';
import { ReferralCode } from '../../entity/ReferralCode';
import { CurrentUserController } from './current-user.controller';
import { CurrentUserService } from './current-user.service';
import { OrderProfile } from '../../entity/OrderProfile';
import { Image } from '../../entity/Image';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ReferralCode, OrderProfile, Image]),
    forwardRef(() => ClientModule),
  ],
  controllers: [AuthController, CurrentUserController],
  providers: [AuthService, CurrentUserService],
  exports: [AuthService],
})
export class AuthModule {}
