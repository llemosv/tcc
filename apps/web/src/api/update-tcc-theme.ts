import { api } from '@/lib/axios'

export interface UpdateTccTheme {
  id: string
  theme: string
}

export async function updateTccTheme({
  id,
  theme,
}: UpdateTccTheme): Promise<void> {
  await api.put(`/tccGuidances/updateTccTheme/${id}`, {
    theme,
  })
}
