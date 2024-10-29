import { api } from '@/lib/axios'

export interface CreateTask {
  id_tcc: string
  tarefa: string
  data_criacao: string
  previsao_entrega: string
}

export async function createTask({
  id_tcc,
  tarefa,
  data_criacao,
  previsao_entrega,
}: CreateTask): Promise<void> {
  await api.post(`/tasks/create`, {
    id_tcc,
    tarefa,
    data_criacao,
    previsao_entrega,
  })
}
