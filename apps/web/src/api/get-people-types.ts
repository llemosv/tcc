import { api } from '@/lib/axios'

export interface Type {
  id: string
  type: string
}

export async function getPeopleTypes(): Promise<Type[]> {
  const response = await api.get<Type[]>(`/people/getPeopleTypes`)

  return response.data
}
