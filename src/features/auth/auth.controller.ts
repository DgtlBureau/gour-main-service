import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { decodeToken, encodeJwt, encodeRefreshJwt } from './jwt.service';
import { AuthService } from './auth.service';
import { SendCodeDto } from './dto/send-code.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Client } from 'src/entity/Client';

export interface AppRequest extends Request {
  user?: Client;
  token?: string;
}

@ApiTags('client-auth')
@Controller('client-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('send-code')
  sendCode(@Payload() dto: SendCodeDto) {
    this.authService.sendCode(dto.phone);
    return {
      result: true,
    };
  }

  @MessagePattern('signup')
  signup(@Payload() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @MessagePattern('signin')
  signin(@Payload() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @MessagePattern('refresh')
  refresh(@Payload() token: string) {
    const user = decodeToken(token) as { id: number };

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: user?.id,
    };

    const accessToken = encodeJwt(payload);
    const refreshToken = encodeRefreshJwt(payload);

    return { accessToken, refreshToken };
  }
}
