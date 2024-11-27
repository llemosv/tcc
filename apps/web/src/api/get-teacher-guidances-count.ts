import { api } from '@/lib/axios'

export interface GuidanceCount {
  professor: string
  numero_trabalhos: number
}

interface IGetTeacherGuidancesCount {
  id_course: string
}

export async function getTeacherGuidancesCount({
  id_course,
}: IGetTeacherGuidancesCount): Promise<GuidanceCount[]> {
  const response = await api.get<GuidanceCount[]>(
    `/tccGuidances/getTeacherGuidancesCount/${id_course}`,
  )

  return response.data
}
