import { api } from '@/lib/axios'

export interface TasksCount {
  status: string
  deliveries: number
  fill: string
}

export async function getTasksCount(id_task: string): Promise<TasksCount[]> {
  const response = await api.get<TasksCount[]>(`/tasks/count/${id_task}`)

  return response.data
}
