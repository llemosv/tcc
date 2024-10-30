import { api } from '@/lib/axios'

export interface PendingReviewTask {
  id: string
}

export async function pendingReviewTaskTopic({
  id,
}: PendingReviewTask): Promise<void> {
  await api.patch(`topics/${id}/review`)
}
