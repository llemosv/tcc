import { api } from '@/lib/axios'

export interface Task {
  id: number
  tarefa: string
  data_criacao: string
  previsao_entrega: string
  data_finalizacao: string
}

export async function getTasks(id_task: number): Promise<Task[]> {
  const response = await api.get<Task[]>(`/tasks/${id_task}`)

  return response.data
}
