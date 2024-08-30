import { api } from '@/lib/axios'

export interface Task {
  id: number
  tarefa: string
  data_criacao: string
  previsao_entrega: string
  data_finalizacao: string
}

export async function getPendingTasks(id_trabalho: number): Promise<Task[]> {
  const response = await api.get<Task[]>(`/tasks/pending/${id_trabalho}`)

  return response.data
}
