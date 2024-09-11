import { api } from '@/lib/axios'

export interface Teacher {
  id: number
  nome: string
  email: string
  curso: string
}

export async function getTeachers(idCourse: string): Promise<Teacher[]> {
  const response = await api.get<Teacher[]>(`/people/getTeachers/${idCourse}`)

  return response.data
}
