import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { Challenge } from './interfaces/challenge.interface';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';
import { AssignChallengeToMatchDto } from './dto/assign-challenge-to-match.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    this.logger.log(`createCategoryDto: ${JSON.stringify(createChallengeDto)}`);
    return await this.challengesService.createChellenge(createChallengeDto);
  }

  @Get()
  async consultChallenges(
    @Query('idPlayer') _id: string,
  ): Promise<Array<Challenge>> {
    return _id
      ? await this.challengesService.consultChallengesFromPlayer(_id)
      : await this.challengesService.consultAllChallenges();
  }

  @Put('/:_id')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallenge: UpdateChallengeDto,
    @Param('_id') _id: string,
  ): Promise<void> {
    console.log(updateChallenge);
    console.log('id:' + _id);
    await this.challengesService.updateChallenge(_id, updateChallenge);
  }

  @Post('/:challenge/match/')
  async assignChallengeMatch(
    @Body(ValidationPipe) assignChallengeMatchDto: AssignChallengeToMatchDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.AssignChallengeMatch(
      _id,
      assignChallengeMatchDto,
    );
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string): Promise<void> {
    await this.challengesService.deleteChallenge(_id);
  }
}
