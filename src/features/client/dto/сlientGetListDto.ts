import { IsOptional } from 'class-validator';
import { BaseGetListDto } from '../../../common/dto/base-get-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEntityExists } from '../../../common/validationDecorators/IsEntityExists';
import { ClientRole } from '../../../entity/ClientRole';

export class ClientGetListDto extends BaseGetListDto {
  @IsOptional()
  @ApiPropertyOptional()
  isApproved?: boolean;

  @IsOptional()
  @IsEntityExists(() => ClientRole)
  @ApiPropertyOptional()
  roleId?: number;
}
