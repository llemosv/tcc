import { api } from '@/lib/axios'

export interface ValidateUserBody {
  email: string
  cpf: string
}

export async function validateUser({ email, cpf }: ValidateUserBody) {
  const credentials = await api.post('/auth/validateUser', { email, cpf })

  return credentials
}
