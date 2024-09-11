import { api } from '@/lib/axios'

export interface TopicMessage {
  id_mensagem: string
  id_topic: string
  id_autor: string
  conteudo: string
  data_criacao: string
  autor: string
}

export async function getMessages(idTopic: string): Promise<TopicMessage[]> {
  const response = await api.get<TopicMessage[]>(`/topics/messages/${idTopic}`)

  return response.data
}
