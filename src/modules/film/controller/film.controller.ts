import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { FilmService } from '../service/film.service';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Film } from '../entity/film.entity';
import { IdParams } from '../../../utils/dtos/Commons.dto';
import { CreateFilmDto, FilmPaginationDto, UpdateFilmDto } from '../dtos/film.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt.guard';
import { RolesGuard } from 'src/modules/auth/guard/role.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from 'src/modules/user/entity/user.entity';
import { Roles } from 'src/utils/decorator/role.decorator';
import { Role } from 'src/utils/enum/role.enum';
@Controller('films')
@ApiTags('Films')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FilmController {
  constructor(private service: FilmService) {}

  FilmService(): FilmService {
    return this.service;
  }

  @Get('/')
  @ApiOkResponse({ type: FilmPaginationDto })
  async findAll() {
    const films = await this.FilmService().findAll();
    return films;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiOkResponse({ type: Film, description: 'Film detail' })
  @ApiNotFoundResponse({ description: 'Film not found' })
  findOne(@Param() params: IdParams) {
    return this.FilmService().findByIdOrFail(params.id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBody({ type: CreateFilmDto, required: true })
  @ApiCreatedResponse({ description: 'Film created' })
  async save(@Body() entity: CreateFilmDto, @CurrentUser() user: User) {
    return this.FilmService().createFilm(entity.id, user.id);
  }

  @Post('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCreatedResponse({ description: 'Film created' })
  async saveAll(@CurrentUser() user: User) {
    return this.FilmService().createAllFilms(user);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiNoContentResponse({ description: 'Film deleted' })
  @ApiNotFoundResponse({ description: 'The Film you want to delete does not exist' })
  async delete(@Param() params: IdParams) {
    await this.FilmService().deleteFilm(params.id);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiNoContentResponse({ description: 'Film updated' })
  @ApiNotFoundResponse({ description: 'The Film you want to update does not exist' })
  async update(@Param() params: IdParams, @Body() entity: UpdateFilmDto) {
    await this.FilmService().update(params.id, entity);
  }
}
