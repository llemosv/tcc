import { api } from '@/lib/axios'

export interface Task {
  id: string
  tarefa: string
  data_criacao: string
  previsao_entrega: string
  data_finalizacao: string
  data_pendente_revisao: string
  justificativa: string | null
}

interface GetTasks {
  idTask: string
  taskName?: string | null
  status?: string | null
}

export async function getTasks({
  idTask,
  taskName = null,
  status = null,
}: GetTasks): Promise<Task[]> {
  const response = await api.get<Task[]>(`/tasks/${idTask}`, {
    params: {
      taskName,
      status,
    },
  })

  return response.data
}
