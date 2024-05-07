import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { Film } from '../entity/film.entity';
import { PaginationDto } from '../../../utils/dtos/Pagination.dto';
import { FilmQueryDto } from '../dtos/film.dto';

@Injectable()
export class FilmRepository extends Repository<Film> {
  constructor(@InjectRepository(Film) private readonly _: Repository<Film>) {
    super(_.target, _.manager, _.queryRunner);
  }

  async findFilmsByFiltersPaginated(payload: FilmQueryDto) {
    const { page, pageSize, title } = payload;

    const pageNumber = page ?? 0;
    const take = pageSize ?? 10;
    const skip = Math.max(0, pageNumber) * take;

    const query = this.createQueryBuilder('film');

    if (title) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('UPPER(film.title) LIKE UPPER(:title)', { title: `%${title}%` });
        }),
      );
    }
    query.orderBy('film.title', 'ASC');

    const [data, total] = await query.take(take).skip(skip).getManyAndCount();

    return new PaginationDto({
      data,
      page,
      pageSize: take,
      lastPage: total ? Math.ceil(total / take) - 1 : 0,
      total,
    });
  }
}
