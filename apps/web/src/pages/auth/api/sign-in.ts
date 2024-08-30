import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
  senha: string
}

export async function signIn({ email, senha }: SignInBody) {
  const credentials = await api.post('/auth', { email, senha })

  return credentials
}
