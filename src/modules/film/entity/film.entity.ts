import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { EntityBase } from '../../../utils/entity/entity-base';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Film extends EntityBase {
  @ApiProperty({
    description: 'Title of the film',
    type: String,
  })
  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiProperty({
    description: 'Episode identifier of the film',
    type: Number,
  })
  @Column({ nullable: false })
  @IsNotEmpty()
  episodeId!: number;

  @ApiProperty({
    description: 'Opening crawl text of the film',
    type: String,
  })
  @Column('text')
  @IsString()
  @IsOptional()
  openingCrawl: string;

  @ApiProperty({
    description: 'Director of the film',
    type: String,
  })
  @Column()
  @IsString()
  @IsOptional()
  director: string;

  @ApiProperty({
    description: 'Producer of the film',
    type: String,
  })
  @Column()
  @IsString()
  @IsOptional()
  producer: string;

  @ApiProperty({
    description: 'Release date of the film',
    type: Date,
  })
  @Column()
  releaseDate: Date;

  @ApiProperty({
    description: 'URLs of characters in the film',
    type: 'string',
    isArray: true,
  })
  @Column('simple-array')
  characters: string[];

  @ApiProperty({
    description: 'URLs of planets featured in the film',
    type: 'string',
    isArray: true,
  })
  @Column('simple-array')
  planets: string[];

  @ApiProperty({
    description: 'URLs of starships featured in the film',
    type: 'string',
    isArray: true,
  })
  @Column('simple-array')
  starships: string[];

  @ApiProperty({
    description: 'URLs of vehicles featured in the film',
    type: 'string',
    isArray: true,
  })
  @Column('simple-array')
  vehicles: string[];

  @ApiProperty({
    description: 'URLs of species featured in the film',
    type: 'string',
    isArray: true,
  })
  @Column('simple-array')
  species: string[];

  @ManyToOne(() => User, (user: User) => user.films)
  createdBy: User;
}
