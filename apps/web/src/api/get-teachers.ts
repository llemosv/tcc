import { api } from '@/lib/axios'

export interface Teacher {
  id: number
  nome: string
  email: string
  curso: string
}

export async function getTeachers(id_course: number): Promise<Teacher[]> {
  const response = await api.get<Teacher[]>(`/people/getTeachers/${id_course}`)

  return response.data
}
