import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { FilmError } from '../enum/film-error.enum';
import { UtilsService } from '../../../utils/services/utils.service';
import { Film } from '../entity/film.entity';
import { FilmRepository } from '../repository/film.repository';
import { FilmDto, FilmQueryDto, UpdateFilmDto } from '../dtos/film.dto';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class FilmService extends UtilsService<Film> {
  constructor(
    @Inject(FilmRepository) private readonly repository: FilmRepository,
    @Inject(UserService) private readonly userService: UserService,
  ) {
    super();
  }

  protected getRepository() {
    return this.repository;
  }

  async createFilm(film: FilmDto, userId: string) {
    const filmDb = await this.findOneByFilter({ where: [{ title: film.title }] });
    if (filmDb) throw new ForbiddenException({ type: FilmError.FILM_TITLE_EXISTS });
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    const newFilm = { ...film, user };
    super.create(newFilm);
    return 'Film created';
  }

  async update(id: string, filmDto: UpdateFilmDto, userId: string) {
    if (!!filmDto.title && !!filmDto.description) {
      const filmDb = await this.findOneByFilter({
        where: [{ id }],
        relations: ['user'],
      });

      if (userId !== filmDb.user.id)
        throw new ForbiddenException({ type: FilmError.FILM_OWNER_DIFFERENT });
    }
    return this.updateById(id, filmDto);
  }

  public async deleteFilm(id: string, userId) {
    const filmDb = await this.findOneByFilter({
      where: [{ id }],
      relations: ['user'],
    });

    if (!filmDb) throw new NotFoundException(`Film with id ${id} not found`);

    if (userId !== filmDb.user.id)
      throw new ForbiddenException({ type: FilmError.FILM_OWNER_DIFFERENT });

    return this.getRepository().softDelete(id);
  }

  async findWithFiltersAndPagination(payload: FilmQueryDto) {
    return this.getRepository().findFilmsByFiltersPaginated(payload);
  }
}
