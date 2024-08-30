import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { TccGuidancesService } from './tcc-guidances.service';
import {
  CreateTccGuidanceDTO,
  createTccGuidanceSchema,
} from './dtos/create-tcc-guidance.dto';
import {
  RespondGuidanceRequestDTO,
  respondGuidanceRequestSchema,
} from './dtos/respond-to-guidance-request.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('tccGuidances')
export class TccGuidancesController {
  constructor(private readonly tccGuidancesService: TccGuidancesService) {}

  @Post('create')
  async create(
    @Body(new ZodValidationPipe(createTccGuidanceSchema))
    createSolicitationDto: CreateTccGuidanceDTO,
  ) {
    return await this.tccGuidancesService.create(createSolicitationDto);
  }

  @Get('findGuidancesStudent/:id')
  async findGuidancesStudent(@Param('id') id: number) {
    return await this.tccGuidancesService.findGuidancesStudent(id);
  }

  @Put('respondToGuidanceRequest/:id')
  async respondToGuidanceRequest(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(respondGuidanceRequestSchema))
    respondGuidanceRequestDTO: RespondGuidanceRequestDTO,
  ): Promise<any> {
    await this.tccGuidancesService.respondToGuidanceRequest(
      id,
      respondGuidanceRequestDTO,
    );
  }
}
