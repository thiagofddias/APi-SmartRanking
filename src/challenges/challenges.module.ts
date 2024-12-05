import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { PlayersModule } from 'src/players/players.module';
import { MatchSchema } from './interfaces/match.schema';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Challenge', schema: ChallengeSchema },
      { name: 'Match', schema: MatchSchema },
    ]),
    PlayersModule,
    CategoriesModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
