import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModule: Model<Category>,
    private readonly playerService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const categoryFound = await this.categoryModule
      .findOne({ category })
      .exec();

    if (categoryFound) {
      throw new BadRequestException('Category already exists');
    }

    const createdCategory = new this.categoryModule(createCategoryDto);

    return await createdCategory.save();
  }

  async findAllCategory(): Promise<Category[]> {
    return await this.categoryModule.find().populate('players').exec();
  }

  async findCategory(category: string): Promise<Category> {
    const categoryFound = await this.categoryModule
      .findOne({ category })
      .exec();

    if (!categoryFound) {
      throw new NotFoundException('Category not found');
    }

    return categoryFound;
  }

  async updateCategory(
    category: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const categoryFound = await this.categoryModule
      .findOne({ category })
      .exec();

    if (!categoryFound) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryModule
      .findOneAndUpdate({ category }, { $set: updateCategoryDto })
      .exec();
  }

  async includeCategoryToPlayer(params: string[]): Promise<void> {
    const category = params['category'];
    const playerId = params['playerId'];

    const categoryFound = await this.categoryModule
      .findOne({ category })
      .exec();

    const playerFounded = await this.categoryModule
      .find({ category })
      .where('players')
      .in(playerId)
      .exec();

    await this.playerService.consultPlayerById(playerId);

    if (!categoryFound) {
      throw new BadRequestException('Category not found');
    }

    if (playerFounded.length > 0) {
      throw new BadRequestException('Player already included in this category');
    }

    categoryFound.players.push(playerId);

    await this.categoryModule
      .findOneAndUpdate({ category }, { $set: categoryFound })
      .exec();
  }
}
