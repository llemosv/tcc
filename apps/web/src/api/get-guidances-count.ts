import { api } from '@/lib/axios'

export interface GuidanceCount {
  count: number
}

interface IGetGuidancesCount {
  id_course: string
}

export async function getGuidancesCount({
  id_course,
}: IGetGuidancesCount): Promise<GuidanceCount[]> {
  const response = await api.get<GuidanceCount[]>(
    `/tccGuidances/getGuidancesCount/${id_course}`,
  )

  return response.data
}
