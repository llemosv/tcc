import { api } from '@/lib/axios'

export interface TopicsFiles {
  id: string
  id_topico: string
  nome_arquivo: string
  caminho: string
  data_upload: string
}

export async function getTopicFiles(idTopic: string): Promise<TopicsFiles[]> {
  const response = await api.get<TopicsFiles[]>(`/topics/filesTopic/${idTopic}`)

  return response.data
}
