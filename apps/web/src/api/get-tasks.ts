import { api } from '@/lib/axios'

export interface Task {
  id: string
  tarefa: string
  data_criacao: string
  previsao_entrega: string
  data_finalizacao: string
}

export async function getTasks(idTask: string): Promise<Task[]> {
  const response = await api.get<Task[]>(`/tasks/${idTask}`)

  return response.data
}
