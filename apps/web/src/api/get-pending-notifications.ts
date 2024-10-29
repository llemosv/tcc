import { api } from '@/lib/axios'

export interface Notification {
  id: string
  id_tipo_notificacao: string
  id_usuario_remetente: string
  id_usuario_destinatario: string
  mensagem: string
  lida: boolean
  id_referencia: string
  remetente: string
}

export async function getPendingNotifications(
  userId: string,
): Promise<Notification[]> {
  const response = await api.get<Notification[]>(
    `/notifications/pending/${userId}`,
  )

  return response.data
}
