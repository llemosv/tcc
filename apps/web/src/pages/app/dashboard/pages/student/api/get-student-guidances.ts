import { api } from '@/lib/axios'

export interface StudentGuidance {
  id_orientacao: number
  aluno: string
  orientador: string
  tema: string
  previsao_entrega: string
  solicitacao_aceita: boolean
  data_aprovacao: string | null
  data_reprovacao: string | null
  justificativa_reprovacao: string | null
}

export async function getStudentGuidances(
  student_id: number,
): Promise<StudentGuidance[]> {
  const response = await api.get<StudentGuidance[]>(
    `/tccGuidances/findGuidancesStudent/${student_id}`,
  )

  return response.data
}
