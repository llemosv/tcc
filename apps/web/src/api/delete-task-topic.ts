import { api } from '@/lib/axios'

export interface DeleteTaskTopic {
  id: string
}

export async function deleteTaskTopic({ id }: DeleteTaskTopic): Promise<void> {
  await api.delete(`topics/delete/${id}`)
}
