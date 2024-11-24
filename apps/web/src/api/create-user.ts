import { api } from '@/lib/axios'

export interface CreateUser {
  nome: string
  email: string
  senha: string
  cpf: string
  fl_ativo: boolean
  id_tipo_pessoa: string
  id_courses: string[]
}

export async function createUser({
  nome,
  email,
  senha,
  cpf,
  fl_ativo,
  id_tipo_pessoa,
  id_courses,
}: CreateUser): Promise<void> {
  await api.post(`/people/create`, {
    nome,
    email,
    senha,
    cpf,
    fl_ativo,
    id_tipo_pessoa,
    id_courses,
  })
}
