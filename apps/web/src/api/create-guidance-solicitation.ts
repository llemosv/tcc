import { api } from '@/lib/axios'

export interface CreateGuidanceSolicitation {
  id_aluno_solicitante: number
  id_professor_orientador: number
  solicitacao_aceita: boolean
  tema: string
  previsao_entrega: string
}

export async function creteGuidanceSolicitation({
  id_aluno_solicitante,
  id_professor_orientador,
  previsao_entrega,
  solicitacao_aceita,
  tema,
}: CreateGuidanceSolicitation): Promise<void> {
  await api.post(`/tccGuidances/create`, {
    id_aluno_solicitante,
    id_professor_orientador,
    previsao_entrega,
    solicitacao_aceita,
    tema,
  })
}
