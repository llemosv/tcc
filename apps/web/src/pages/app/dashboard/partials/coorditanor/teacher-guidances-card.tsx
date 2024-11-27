import { useQuery } from '@tanstack/react-query'

import { getTeacherGuidancesCount } from '@/api/get-teacher-guidances-count'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/hooks/useAuth'

import { CardSkeleton } from '../card-skeleton'

export function TeacherGuidancesCard() {
  const { user } = useAuth()
  const { data: teacherGuidances, isLoading: isLoadingGuidances } = useQuery({
    queryKey: ['get-teacher-guidances', user?.id_curso],
    queryFn: () =>
      getTeacherGuidancesCount({ id_course: String(user?.id_curso) }),
  })
  return (
    <>
      {isLoadingGuidances ? (
        <CardSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Solicitações</CardTitle>
            <CardDescription>
              Solicitações de orientação pendentes de resposta
            </CardDescription>
          </CardHeader>
          <CardContent className="flex">
            {teacherGuidances && teacherGuidances.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orientador</TableHead>
                    <TableHead>Quantidade Orientações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherGuidances.map((tcc, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {tcc.professor}
                      </TableCell>
                      <TableCell className="font-medium text-primary">
                        {tcc.numero_trabalhos}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <h1 className="flex w-full justify-center py-3 text-lg font-medium">
                Nenhum professor com orientação
              </h1>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
