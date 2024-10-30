import { api } from '@/lib/axios'

export interface Topics {
  id: string
  id_task: string
  titulo: string
  descricao: string
  data_criacao: string
  previsao_entrega: string
  data_finalizacao: string | null
  justificativa: string | null
  data_pendente_revisao: string | null
}

export async function getTopics(idTask: string): Promise<Topics[]> {
  const response = await api.get<Topics[]>(`/topics/${idTask}`)

  return response.data
}
