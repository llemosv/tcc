import { z } from 'zod';

export const createTaskSchema = z.object({
  id_tcc: z.number().min(1),
  tarefa: z.string().min(1),
  data_criacao: z.string().min(1),
  previsao_entrega: z.string().min(1),
});

export type TaskDTO = z.infer<typeof createTaskSchema>;
