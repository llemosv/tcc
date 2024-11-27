import { useQuery } from '@tanstack/react-query'

import { getGuidancesCount } from '@/api/get-guidances-count'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

import { CardSkeleton } from '../card-skeleton'

export function GuidanceInProgressCard() {
  const { user } = useAuth()
  const { data: guidancesCount, isLoading: isLoadingGuidances } = useQuery({
    queryKey: ['guidances-count', user?.id_curso],
    queryFn: () => getGuidancesCount({ id_course: String(user?.id_curso) }),
  })

  return (
    <>
      {isLoadingGuidances ? (
        <CardSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Trabalhos</CardTitle>
            <CardDescription>
              Quantidade de trabalhos em andamento no curso
            </CardDescription>
          </CardHeader>
          <CardContent className="flex">
            {guidancesCount ? (
              <div className="flex min-h-36 w-full items-center justify-center ">
                <h1 className="text-6xl font-semibold text-primary">
                  {guidancesCount[0].count}
                </h1>
              </div>
            ) : (
              <h1 className="flex w-full justify-center py-3 text-lg font-medium">
                Nenhum trabalho pendente
              </h1>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
