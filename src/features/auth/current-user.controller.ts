import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { Client } from '../../entity/Client';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from './auth.service';
import { ClientsService } from '../client/client.service';
import { ChangePhoneDto } from './dto/change-phone.dto';
import { decodePhoneCode, encodePhoneCode } from './jwt.service';
import { Response, Request } from 'express';
import { SendCodeDto } from './dto/send-code.dto';
import { CurrentUserService } from './current-user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AddToFavoritesDto } from './dto/add-to-favorites.dto';
import { ChangeCityDto } from './dto/change-city.dto';

const PHONE_CODE_KEY = 'PhoneCode';

@ApiTags('current-user')
@Controller('client-auth/currentUser')
export class CurrentUserController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientsService: ClientsService,
    private readonly currentUserService: CurrentUserService,
  ) {}
  @ApiBearerAuth()
  @Get('/')
  getCurrentUser(@CurrentUser() currentUser: Client) {
    return this.currentUserService.getUser(currentUser.id);
  }

  @ApiBearerAuth()
  @Put('/')
  updateCurrentUser(
    @CurrentUser() currentUser: Client,
    @Body() dto: UpdateUserDto,
  ) {
    return this.currentUserService.updateCurrentUser(currentUser.id, dto);
  }

  @ApiBearerAuth()
  @Post('/phone/sendCode')
  async sendCode(
    @CurrentUser() currentUser: Client,
    @Body() dto: SendCodeDto,
    @Res() res: Response,
  ) {
    const code = await this.authService.sendCode(dto.phone);
    const hashedCode = encodePhoneCode(dto.phone, code);
    res.cookie(PHONE_CODE_KEY, hashedCode);

    return res.send({
      result: 'Code successfully sent',
    });
  }

  @ApiBearerAuth()
  @Post('/phone/change')
  async changePhone(
    @CurrentUser() currentUser: Client,
    @Body() dto: ChangePhoneDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const hashedCode = req.cookies[PHONE_CODE_KEY];
    await this.currentUserService.changePhone(currentUser, hashedCode, dto);

    res.cookie(PHONE_CODE_KEY, '');
    return res.send({
      result: true,
    });
  }

  @ApiBearerAuth()
  @Post('/change-password')
  async changePassword(
    @CurrentUser() currentUser: Client,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.currentUserService.changePassword(currentUser.id, dto);
  }

  @Get('/favorites')
  getFavoritesProducts(@CurrentUser() currentUser: Client) {
    return this.clientsService.getFavorites(currentUser.id);
  }

  @Post('/favorites')
  addProductToFavorites(
    @CurrentUser() currentUser: Client,
    @Body() addToFavoritesDto: AddToFavoritesDto,
  ) {
    return this.clientsService.addToFavorites(
      currentUser.id,
      addToFavoritesDto.productId,
    );
  }

  @Delete('/favorites/:productId')
  removeProductFromFavorites(
    @CurrentUser() currentUser: Client,
    @Param('productId') productId: string,
  ) {
    return this.clientsService.removeFromFavorites(currentUser.id, +productId);
  }

  @Put('/change-city')
  changeCity(
    @CurrentUser() currentUser: Client,
    @Body() changeCityDto: ChangeCityDto,
  ) {
    return this.currentUserService.changeCityId(
      currentUser.id,
      changeCityDto.cityId,
    );
  }
}
