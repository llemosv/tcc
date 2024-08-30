import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

import { AuthDTO, authSchema } from './dtos/auth.dto';
import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';
import { LocalAuthGuard } from './strategies/local.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UsePipes(LocalAuthGuard)
  async login(
    @Body(new ZodValidationPipe(authSchema)) authDto: AuthDTO,
    @Res() response: Response,
  ) {
    const user = await this.authService.validateUser(authDto);
    const token = await this.authService.generateToken(authDto, user);

    return response.status(200).json(token);
  }
}
