import { api } from '@/lib/axios'

export async function readAllNotifications(userId: string): Promise<void> {
  await api.post(`/notifications/readAll/${userId}`)
}
