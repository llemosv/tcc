import { api } from '@/lib/axios'

export interface ConcludeTask {
  id: string
  conclude: boolean
  justification: string
}

export async function concludeTaskTopic({
  id,
  conclude,
  justification,
}: ConcludeTask): Promise<void> {
  await api.patch(`topics/${id}/conclude`, {
    conclude,
    justification,
  })
}
