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
import { FilmDto, FilmPaginationDto, UpdateFilmDto } from '../dtos/film.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt.guard';
import { RolesGuard } from 'src/modules/auth/guard/role.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from 'src/modules/user/entity/user.entity';
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
  @ApiOkResponse({ type: Film, description: 'Film detail' })
  @ApiNotFoundResponse({ description: 'Film not found' })
  findOne(@Param() params: IdParams) {
    return this.FilmService().findByIdOrFail(params.id);
  }

  @Post('/')
  @ApiBody({ type: FilmDto, required: true })
  @ApiCreatedResponse({ description: 'Film created' })
  async save(@Body() entity: FilmDto, @CurrentUser() user: User) {
    return this.FilmService().createFilm(entity, user.id);
  }

  @Delete('/:id')
  @ApiNoContentResponse({ description: 'Film deleted' })
  @ApiNotFoundResponse({ description: 'The Film you want to delete does not exist' })
  async delete(@Param() params: IdParams, @CurrentUser() user: User) {
    await this.FilmService().deleteFilm(params.id, user.id);
  }

  @Put('/:id')
  @ApiNoContentResponse({ description: 'Film updated' })
  @ApiNotFoundResponse({ description: 'The Film you want to update does not exist' })
  async update(
    @Param() params: IdParams,
    @Body() entity: UpdateFilmDto,
    @CurrentUser() user: User,
  ) {
    await this.FilmService().update(params.id, entity, user.id);
  }
}
