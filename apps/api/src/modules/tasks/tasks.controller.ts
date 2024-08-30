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
import { TasksService } from './tasks.service';
import { TaskDTO, createTaskSchema } from './dtos/create-task.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  async create(
    @Body(new ZodValidationPipe(createTaskSchema))
    createTaskDto: TaskDTO,
  ) {
    return await this.tasksService.create(createTaskDto);
  }

  @Get(':id')
  async getTasks(@Param('id') id: number) {
    return await this.tasksService.getTasks(id);
  }

  @Get('pending/:id')
  async getPendingTasks(@Param('id') id: number) {
    return await this.tasksService.getPendingTasks(id);
  }

  @Get('count/:id')
  async getTasksCount(@Param('id') id: number) {
    return await this.tasksService.getTasksCount(id);
  }
}
