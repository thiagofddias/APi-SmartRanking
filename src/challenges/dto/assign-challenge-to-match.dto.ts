import { IsOptional } from 'class-validator';
import { Player } from 'src/players/interfaces/player.interface';
import { Result } from '../interfaces/challenge.interface';

export class AssignChallengeToMatchDto {
  @IsOptional()
  def: Player;

  @IsOptional()
  result: Array<Result>;
}
