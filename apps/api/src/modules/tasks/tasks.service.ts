import * as schema from 'src/shared/database/schema';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM } from 'src/core/constrants/db.constants';
import { TaskDTO } from './dtos/create-task.dto';
import { sql } from 'drizzle-orm';
import { TasksCount } from './dtos/tasks.count.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject(DRIZZLE_ORM) private database: PostgresJsDatabase<typeof schema>,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  async create(createTaskDto: TaskDTO): Promise<void> {
    const { id_tcc, tarefa, data_criacao, previsao_entrega } = createTaskDto;

    await this.database
      .insert(schema.tasks)
      .values({ id_tcc, tarefa, data_criacao, previsao_entrega });
  }

  async getTasks(id_tcc: string): Promise<TaskDTO[]> {
    const response = await this.database.execute(sql`
      select tasks.id, 
             tasks.tarefa, 
             TO_CHAR(tasks.data_criacao, 'DD/MM/YYYY') as data_criacao, 
             TO_CHAR(tasks.previsao_entrega, 'DD/MM/YYYY') as previsao_entrega,
             TO_CHAR(tasks.data_finalizacao, 'DD/MM/YYYY') as data_finalizacao
      from tasks 
      where id_tcc = ${id_tcc}
      order by data_criacao
      `);

    return response;
  }

  async getPendingTasks(id_tcc: number): Promise<TaskDTO[]> {
    const response = await this.database.execute(sql`
      SELECT tasks.id, 
            tasks.tarefa, 
            TO_CHAR(tasks.data_criacao, 'DD/MM/YYYY') AS data_criacao, 
            TO_CHAR(tasks.previsao_entrega, 'DD/MM/YYYY') AS previsao_entrega,
            TO_CHAR(tasks.data_finalizacao, 'DD/MM/YYYY') AS data_finalizacao
      FROM   tasks 
      WHERE  id_tcc = ${id_tcc}
            AND data_finalizacao IS NULL
      ORDER BY tasks.previsao_entrega;

      `);

    return response;
  }

  async getTasksCount(id_tcc: number): Promise<TasksCount[]> {
    const tasks = await this.database.execute(sql`
      select tasks.id, tasks.previsao_entrega, tasks.data_criacao, tasks.data_finalizacao 
      from tasks 
      where id_tcc = ${id_tcc}
      `);
    const today = new Date();

    let overdue = 0;
    let pending = 0;
    let concluded = 0;

    tasks.map((task: any) => {
      const previsaoEntrega = new Date(task.previsao_entrega);

      if (task.data_finalizacao) {
        concluded += 1;
      } else if (today > previsaoEntrega) {
        overdue += 1;
      } else {
        pending += 1;
      }
    });

    const data = [
      { status: 'overdue', deliveries: overdue, fill: 'var(--color-overdue)' },
      { status: 'pending', deliveries: pending, fill: 'var(--color-pending)' },
      {
        status: 'concluded',
        deliveries: concluded,
        fill: 'var(--color-concluded)',
      },
    ];

    return data;
  }
}
