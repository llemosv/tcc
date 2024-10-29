import { api } from '@/lib/axios'

export interface ConcludeTask {
  id: string
}

export async function concludeTask({ id }: ConcludeTask): Promise<void> {
  await api.patch(`tasks/${id}/conclude`)
}
