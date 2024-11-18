import { api } from '@/lib/axios'

export interface UpdatePasswordBody {
  email: string
  cpf: string
  password: string
}

export async function updatePassword({
  email,
  cpf,
  password,
}: UpdatePasswordBody) {
  const credentials = await api.put('/auth/updatePassword', {
    email,
    cpf,
    password,
  })

  return credentials
}
