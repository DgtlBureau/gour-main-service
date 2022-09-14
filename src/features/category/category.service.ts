import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, IsNull, Repository } from 'typeorm';

import { Category } from '../../entity/Category';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { CategoryCreateDto } from './dto/category.create.dto';
import { CategoryUpdateDto } from './dto/category.update.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findMany(params: BaseGetListDto) {
    const options: FindManyOptions<Category> = {
      ...getPaginationOptions(params.offset, params.length),
    };

    return this.categoryRepository
      .createQueryBuilder('top_categories')
      .leftJoinAndSelect('top_categories.parentCategories', 'top_parent')
      .leftJoinAndSelect('top_categories.subCategories', 'mid_categories')
      .leftJoinAndSelect('mid_categories.subCategories', 'bot_categories')

      .leftJoinAndSelect('top_categories.title', 'top_title')
      .leftJoinAndSelect('mid_categories.title', 'mid_title')
      .leftJoinAndSelect('bot_categories.title', 'bot_title')

      .where('top_parent.id IS NULL')
      .skip(options.skip)
      .take(options.take)
      .getManyAndCount();
  }

  async getOne(id: number) {
    try {
      return await this.categoryRepository.findOneOrFail({ id });
    } catch {
      throw new NotFoundException('Категория не найдена');
    }
  }

  async create(dto: CategoryCreateDto) {
    const category: DeepPartial<Category> = { title: dto.title };

    if (dto.subCategoriesIds) {
      category.subCategories = [];
      for (const subCategoryId of dto.subCategoriesIds) {
        const subCategory = await this.getOne(subCategoryId);
        category.subCategories.push(subCategory);
      }
    }

    return this.categoryRepository.save(category);
  }

  async update(id: number, dto: CategoryUpdateDto) {
    const isNotExist = !(await this.getOne(id));

    if (isNotExist) throw new NotFoundException('Категория не найдена');

    const category: DeepPartial<Category> = { title: dto.title };

    if (dto.subCategoriesIds) {
      category.subCategories = [];
      for (const subCategoryId of dto.subCategoriesIds) {
        const subCategory = await this.getOne(subCategoryId);
        category.subCategories.push(subCategory);
      }
    }

    return this.categoryRepository.save({
      ...category,
      id,
    });
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
