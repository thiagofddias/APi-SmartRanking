import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://thiagofdias2:eDMr2a5byleD2RFL@cluster.cjc37.mongodb.net/?retryWrites=true&w=majority&appName=Cluster',
    ),
    PlayersModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
