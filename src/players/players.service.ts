import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    const playerFounded = await this.playerModel.findOne({ email }).exec();

    if (playerFounded) {
      this.update(createPlayerDto);
    } else {
      this.create(createPlayerDto);
    }
  }

  async consultAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async consultPlayerByEmail(email: string): Promise<Player> {
    const playerExists = await this.playerModel.findOne({ email }).exec();

    if (!playerExists) {
      throw new NotFoundException(`Player with email ${email} not found`);
    }

    return playerExists;
  }

  async deletePlayer(email: string): Promise<any> {
    return await this.playerModel.deleteMany({ email }).exec();

    // const playerExists = this.players.find((player) => player.email === email);
    // this.players = this.players.filter(
    //   (player) => player.email !== playerExists.email,
    // );
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const PlayerCreated = new this.playerModel(createPlayerDto);
    return await PlayerCreated.save();

    //   const { name, email, phoneNumber } = createPlayerDto;
    //   const player: Player = {
    //     _id: uuid(),
    //     name,
    //     email,
    //     phoneNumber,
    //     ranking: 'A',
    //     positionRanking: 1,
    //     urlPhotoPlayer: 'www.google.com.br/foto123.jpg',
    //   };
    //   this.logger.log(`createPlayerDto: ${JSON.stringify(player)}`);
    //   this.players.push(player);
  }

  private async update(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDto.email },
        { $set: createPlayerDto },
      )
      .exec();

    // const { name } = createPlayerDto;
    // playerFounded.name = name;
  }
}
