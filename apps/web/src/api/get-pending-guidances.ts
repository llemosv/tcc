import { api } from '@/lib/axios'

export interface Guidance {
  id_orientacao: string
  aluno: string
  orientador: string
  tema: string
  previsao_entrega: string
  solicitacao_aceita: boolean
  data_aprovacao: string | null
  data_reprovacao: string | null
  justificativa_reprovacao: string | null
  total_atividades: number
}

interface IGetPendingGuidances {
  id: string
}

export async function getPendingGuidances({
  id,
}: IGetPendingGuidances): Promise<Guidance[]> {
  const response = await api.get<Guidance[]>(
    `/tccGuidances/findPendingGuidances/${id}`,
  )
  console.log('aaa', id)
  return response.data
}
