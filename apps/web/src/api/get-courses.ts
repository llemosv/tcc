import { api } from '@/lib/axios'

export interface Courses {
  id: string
  type: string
}

export async function getCourses(): Promise<Courses[]> {
  const response = await api.get<Courses[]>(`/people/getCourses`)

  return response.data
}
