import { api } from '@/lib/axios'

export interface ConcludeTcc {
  id_tcc: string
}

export async function concludeTcc({ id_tcc }: ConcludeTcc): Promise<void> {
  await api.post(`tccGuidances/conclude/${id_tcc}`)
}
