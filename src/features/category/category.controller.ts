import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { CategoryCreateDto } from './dto/category.create.dto';
import { CategoryUpdateDto } from './dto/category.update.dto';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('categories')
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('get-categories')
  getAll(@Payload() params: BaseGetListDto) {
    return this.categoryService.findMany(params);
  }

  @MessagePattern('get-category')
  getOne(@Payload() id: string) {
    return this.categoryService.getOne(+id);
  }

  // TODO update or delete on table "category" violates foreign key constraint on table "product"

  @MessagePattern('create-category')
  post(@Payload() category: CategoryCreateDto) {
    return this.categoryService.create(category);
  }

  @MessagePattern('edit-category')
  put(
    @Payload('id') id: string,
    @Payload('category') category: CategoryUpdateDto,
  ) {
    return this.categoryService.update(+id, category);
  }

  @MessagePattern('delete-category')
  remove(@Payload() id: string) {
    return this.categoryService.remove(+id);
  }
}
