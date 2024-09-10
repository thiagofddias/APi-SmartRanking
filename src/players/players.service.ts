import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    const playerFounded = await this.playerModel.findOne({ email }).exec();

    if (playerFounded) {
      throw new NotFoundException(`Player with email ${email} already exists`);
    }

    const PlayerCreated = new this.playerModel(createPlayerDto);
    return await PlayerCreated.save();
  }

  async updatePlayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    const playerFounded = await this.playerModel.findOne({ _id }).exec();

    if (!playerFounded) {
      throw new NotFoundException(`Player with id ${_id} already not exists`);
    }

    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDto })
      .exec();
  }

  async consultAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async consultPlayerById(_id: string): Promise<Player> {
    const playerExists = await this.playerModel.findOne({ _id }).exec();

    if (!playerExists) {
      throw new NotFoundException(`Player with id ${_id} not found`);
    }

    return playerExists;
  }

  async deletePlayer(_id: string): Promise<any> {
    const playerExists = await this.playerModel.findOne({ _id }).exec();

    if (!playerExists) {
      throw new NotFoundException(`Player with id ${_id} not found`);
    }

    return await this.playerModel.deleteMany({ _id }).exec();
  }
}
