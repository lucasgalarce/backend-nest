import { Module } from '@nestjs/common';
import { FilmController } from './controller/film.controller';
import { FilmService } from './service/film.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './entity/film.entity';
import { FilmRepository } from './repository/film.repository';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Film]),
    UserModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [FilmService, FilmRepository],
  controllers: [FilmController],
  exports: [FilmService],
})
export class FilmModule {}
