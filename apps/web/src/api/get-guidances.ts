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

interface IGetGuidances {
  studentId: string
  type: 'aluno' | 'orientador' | 'coordenador'
  name?: string | null
  status?: string | null
}

export async function getGuidances({
  studentId,
  type,
  name = null,
  status = null,
}: IGetGuidances): Promise<Guidance[]> {
  const response = await api.get<Guidance[]>(
    `/tccGuidances/findGuidances/${studentId}/${type}`,
    {
      params: {
        name,
        status,
      },
    },
  )

  return response.data
}
