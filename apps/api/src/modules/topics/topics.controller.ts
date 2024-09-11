import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';
import { TopicsService } from './topics.service';
import { CreateTopicDTO, createTopicSchema } from './dtos/create-topic.dto';
import {
  CreateTopicMessageDTO,
  createTopicMessageSchema,
} from './dtos/create-topic-message.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post('create')
  async create(
    @Body(new ZodValidationPipe(createTopicSchema))
    createTopicDTO: CreateTopicDTO,
  ) {
    return await this.topicsService.create(createTopicDTO);
  }

  @Post('createMessage')
  async createMessage(
    @Body(new ZodValidationPipe(createTopicMessageSchema))
    createTopicMessageDTO: CreateTopicMessageDTO,
  ) {
    return await this.topicsService.createMessage(createTopicMessageDTO);
  }

  @Get('/:idTask')
  async getTaskTopics(@Param('idTask') idTask: string) {
    return await this.topicsService.getTopics(idTask);
  }

  @Get('messages/:idTopic')
  async getTopicMessages(@Param('idTopic') idTopic: string) {
    return await this.topicsService.getMessages(idTopic);
  }
}
