import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    const playerFounded = this.players.find((player) => player.email === email);

    if (playerFounded) {
      this.update(playerFounded, createPlayerDto);
    } else {
      this.create(createPlayerDto);
    }
  }

  async consultAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  async consultPlayerByEmail(email: string): Promise<Player> {
    const playerExists = this.players.find((player) => player.email === email);

    if (!playerExists) {
      throw new NotFoundException(`Player with email ${email} not found`);
    }

    return playerExists;
  }

  async deletePlayer(email: string): Promise<void> {
    const playerExists = this.players.find((player) => player.email === email);

    this.players = this.players.filter(
      (player) => player.email !== playerExists.email,
    );
  }

  private create(createPlayerDto: CreatePlayerDto): void {
    this.logger.log('create function called');
    const { name, email, phoneNumber } = createPlayerDto;

    const player: Player = {
      _id: uuid(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      positionRanking: 1,
      urlPhotoPlayer: 'www.google.com.br/foto123.jpg',
    };
    this.logger.log(`createPlayerDto: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private update(
    playerFounded: Player,
    createPlayerDto: CreatePlayerDto,
  ): void {
    const { name } = createPlayerDto;
    playerFounded.name = name;
  }
}
