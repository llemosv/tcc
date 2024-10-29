import { api } from '@/lib/axios'

export interface AcceptSolicitation {
  id_tcc: string
  accept: boolean
  justification: string
}

export async function acceptSolicitation({
  id_tcc,
  accept,
  justification,
}: AcceptSolicitation): Promise<void> {
  await api.put(`/tccGuidances/respondToGuidanceRequest/${id_tcc}`, {
    accept,
    justification,
  })
}
