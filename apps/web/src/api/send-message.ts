import { api } from '@/lib/axios'

export interface SendMessage {
  id_topic: string
  id_autor: string
  conteudo: string
}

export async function sendMessage({
  id_topic,
  id_autor,
  conteudo,
}: SendMessage): Promise<void> {
  await api.post(`/topics/createMessage`, {
    id_topic,
    id_autor,
    conteudo,
  })
}
