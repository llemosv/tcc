import { api } from '@/lib/axios'

export interface TasksPendingApproval {
  id: string
  id_tcc: string
  tarefa: string
  data_criacao: string
  solicitacao_revisao: string
  previsao_entrega: string
}

interface GetTasksPendingApproval {
  idProfessor: string
}

export async function getTasksPendingApproval({
  idProfessor,
}: GetTasksPendingApproval): Promise<TasksPendingApproval[]> {
  const response = await api.get<TasksPendingApproval[]>(
    `/tasks/pendingApproval/${idProfessor}`,
  )

  return response.data
}
