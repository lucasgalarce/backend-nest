import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { AuthService } from '../service/auth.service';
import { RequestWithUser } from '../types/request.user.type';
import { AuthDto, SessionDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserService } from 'src/modules/user/service/user.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService, private readonly userService: UserService) {}

  @Post('login')
  @ApiBody({ type: AuthDto })
  @ApiOkResponse({ type: SessionDto, description: 'User authenticated' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: AuthDto) {
    const { username, password } = body;
    return this.authService.login(username, password);
  }

  @Post('/sign-up')
  @ApiBody({ type: UserDto, required: true })
  @ApiCreatedResponse({ type: UserDto, description: 'User created' })
  async signup(@Body() entity: UserDto): Promise<string> {
    await this.userService.create(entity);
    return 'User created';
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOkResponse({ description: 'Profile user' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async me(@Request() req: RequestWithUser) {
    return req.user;
  }
}
