import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { PaginationDto, RequestPaginationDto } from '../../../utils/dtos/Pagination.dto';
import { Film } from '../entity/film.entity';

export class CreateFilmDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class UpdateFilmDto extends PartialType(Film) {}

export class FilmQueryDto extends RequestPaginationDto {
  @ApiProperty({ description: 'Title filter', required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'User id', required: true })
  @IsString()
  user: string;
}

export class FilmPaginationDto extends PaginationDto<Film> {
  @ApiProperty({ type: Film, isArray: true })
  data: Film[];
}
