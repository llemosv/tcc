import { api } from '@/lib/axios'

export interface PendingReviewTask {
  id: string
}

export async function pendingReviewTask({
  id,
}: PendingReviewTask): Promise<void> {
  await api.patch(`tasks/${id}/review`)
}
