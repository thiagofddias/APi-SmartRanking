import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge, Match } from './interfaces/challenge.interface';
import { Model } from 'mongoose';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { PlayersService } from 'src/players/players.service';
import { CategoriesService } from 'src/categories/categories.service';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { AssignChallengeToMatchDto } from './dto/assign-challenge-to-match.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChellenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    const players = await this.playersService.consultAllPlayers();

    createChallengeDto.players.map((playerDto) => {
      const playerFilter = players.filter(
        (player) => player._id == playerDto._id,
      );

      if (playerFilter.length == 0) {
        throw new BadRequestException(
          `The id ${playerDto._id} not is a player!`,
        );
      }
    });

    const applicantAndPlayerFromMatch = await createChallengeDto.players.filter(
      (player) => player._id == createChallengeDto.applicant,
    );

    this.logger.log(
      `applicantAndPlayerFromMatch: ${applicantAndPlayerFromMatch}`,
    );

    if (applicantAndPlayerFromMatch.length == 0) {
      throw new BadRequestException(`The applicant needs to be a player!`);
    }

    const challengeCreated = new this.challengeModel(createChallengeDto);
    challengeCreated.dateTimeRequest = new Date();

    challengeCreated.status = ChallengeStatus.PENDING;
    this.logger.log(`challengeCreated: ${JSON.stringify(challengeCreated)}`);
    return await challengeCreated.save();
  }

  async consultAllChallenges(): Promise<Array<Challenge>> {
    return await this.challengeModel
      .find()
      .populate('players')
      .populate('match')
      .exec();
  }

  async consultChallengesFromPlayer(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.consultAllPlayers();

    const playerFilter = players.filter((player) => player._id == _id);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`The id ${_id} not is a player!`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('players')
      .populate('match')
      .exec();
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const challengerFound = await this.challengeModel.findById(_id).exec();

    if (!challengerFound) {
      throw new NotFoundException(`Challenge ${_id} not registered!`);
    }

    if (updateChallengeDto.status) {
      challengerFound.dateTimeResponse = new Date();
    }
    challengerFound.status = updateChallengeDto.status;
    challengerFound.dateTimeChallenge = updateChallengeDto.dateTimeChallenge;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challengerFound })
      .exec();
  }

  async AssignChallengeMatch(
    _id: string,
    assignChallengeMatchDto: AssignChallengeToMatchDto,
  ): Promise<void> {
    const challengerFound = await this.challengeModel.findById(_id).exec();

    if (!challengerFound) {
      throw new BadRequestException(`Challenge ${_id} not its registered!`);
    }

    const playerFilter = challengerFound.players.filter(
      (player) => player._id == assignChallengeMatchDto.def,
    );

    this.logger.log(`challengerFound: ${challengerFound}`);
    this.logger.log(`playerFilter: ${playerFilter}`);

    if (playerFilter.length == 0) {
      throw new BadRequestException(
        `The player ${assignChallengeMatchDto.def} not is a player of challenge!`,
      );
    }

    const matchCreated = new this.matchModel(assignChallengeMatchDto);

    matchCreated.category = challengerFound.category;

    matchCreated.players = challengerFound.players;

    const result = await matchCreated.save();

    challengerFound.status = ChallengeStatus.DONE;

    challengerFound.match = result;

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challengerFound })
        .exec();
    } catch (error) {
      await this.matchModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException(error);
    }
  }

  async deleteChallenge(_id: string): Promise<void> {
    const challengerFound = await this.challengeModel.findById(_id).exec();

    if (!challengerFound) {
      throw new BadRequestException(`Challenge ${_id} not registered!`);
    }

    challengerFound.status = ChallengeStatus.CANCELLED;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: challengerFound })
      .exec();
  }
}
