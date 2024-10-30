import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';
import { TasksService } from './tasks.service';
import { TaskDTO, createTaskSchema } from './dtos/create-task.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
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

  @Patch(':id/conclude')
  async concludeTask(@Param('id') id: string) {
    console.log(id);
    return await this.tasksService.concludeTask(id);
  }

  @Get(':id')
  async getTasks(
    @Param('id') id: string,
    @Query('taskName') taskName?: string,
    @Query('status') status?: 'concluded' | 'delayed' | 'pending',
  ) {
    return await this.tasksService.getTasks(id, taskName, status);
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
