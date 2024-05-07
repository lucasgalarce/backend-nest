import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { FilmError } from '../enum/film-error.enum';
import { UtilsService } from '../../../utils/services/utils.service';
import { Film } from '../entity/film.entity';
import { FilmRepository } from '../repository/film.repository';
import { FilmQueryDto, UpdateFilmDto } from '../dtos/film.dto';
import { UserService } from '../../user/service/user.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import _ from 'lodash';
import { User } from 'src/modules/user/entity/user.entity';

@Injectable()
export class FilmService extends UtilsService<Film> {
  constructor(
    @Inject(FilmRepository) private readonly repository: FilmRepository,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(HttpService) private readonly httpService: HttpService,
  ) {
    super();
  }

  protected getRepository() {
    return this.repository;
  }

  async createFilm(id, userId: string) {
    const apiFilm = await this.fetchFilms(id);
    const film: Film = this.convertKeysToCamelCase(apiFilm);
    const filmDb = await this.findOneByFilter({ where: [{ title: film.title }] });
    if (filmDb) throw new ForbiddenException({ type: FilmError.FILM_TITLE_EXISTS });
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    const newFilm = { ...film, releaseDate: new Date(film.releaseDate), createdBy: user };
    super.create(newFilm);
    return newFilm;
  }

  async createAllFilms(user: User): Promise<Film[]> {
    const result = await this.fetchFilms();
    const films: Film[] = [];

    for (const apiFilm of result.results) {
      const filmData = this.convertKeysToCamelCase(apiFilm);

      const existingFilm = await this.findOneByFilter({
        where: { title: filmData.title },
      });

      if (!existingFilm) {
        films.push({ ...filmData, releaseDate: new Date(filmData.releaseDate), createdBy: user });
      }
    }

    await this.repository.save(films);
    return films;
  }

  async update(id: string, filmDto: UpdateFilmDto) {
    return this.updateById(id, filmDto);
  }

  public async deleteFilm(id: string) {
    const filmDb = await this.findOneByFilter({
      where: [{ id }],
    });

    if (!filmDb) throw new NotFoundException(`Film with id ${id} not found`);

    return this.getRepository().delete(id);
  }

  async findWithFiltersAndPagination(payload: FilmQueryDto) {
    return this.getRepository().findFilmsByFiltersPaginated(payload);
  }

  private async fetchFilms(id?: number) {
    const baseUrl = 'https://swapi.dev/api';
    const url = `${baseUrl}/films/${id ? id : ''}`;
    const response = this.httpService.get(url);
    const responseData = await lastValueFrom(response);

    return responseData.data;
  }

  private convertKeysToCamelCase(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertKeysToCamelCase(item));
    }

    return _.mapKeys(obj, (value, key) => _.camelCase(key));
  }
}
