import { api } from '@/lib/axios'

export interface CreateTopic {
  id_task: string
  titulo: string
  descricao: string
  data_criacao: string
  previsao_entrega: string
}

export async function createTopic({
  id_task,
  titulo,
  descricao,
  data_criacao,
  previsao_entrega,
}: CreateTopic): Promise<void> {
  await api.post(`/topics/create`, {
    id_task,
    titulo,
    descricao,
    data_criacao,
    previsao_entrega,
  })
}
