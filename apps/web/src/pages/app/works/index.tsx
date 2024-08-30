import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { CreateGuidanceSolicitationDialog } from '@/components/create-guidance-solicitation-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

import { getStudentGuidances } from '../dashboard/pages/student/api/get-student-guidances'
import { CardSkeleton } from './partials/card-skeleton'

export function Works() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: works, isLoading: isLoadingGuidances } = useQuery({
    queryKey: ['works'],
    queryFn: () => getStudentGuidances(user?.id!),
  })

  function handleViewProjects(id: number | string) {
    navigate(`/works/${id}`)
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-center">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Trabalhos
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button">Solicitar orientação</Button>
          </DialogTrigger>

          <CreateGuidanceSolicitationDialog />
        </Dialog>
      </div>
      {isLoadingGuidances ? (
        <CardSkeleton />
      ) : works?.length === 0 ? (
        <p>criat trabai</p>
      ) : (
        works &&
        works.map((work) => (
          <Card key={work.id_orientacao}>
            <CardHeader>
              <CardTitle>{work.tema}</CardTitle>
              <div className="flex justify-between">
                <CardDescription>
                  Orientador: <strong>{work.orientador}</strong>
                </CardDescription>
                <CardDescription>
                  Previsão de entrega: <strong>{work.previsao_entrega}</strong>
                </CardDescription>
              </div>
              <div className="flex justify-between">
                <CardDescription
                  className={cn(
                    'font-semibold',
                    !work.solicitacao_aceita && !work.data_reprovacao
                      ? 'text-yellow-500'
                      : !work.solicitacao_aceita && work.data_reprovacao
                        ? 'text-red-500 dark:text-red-600'
                        : 'text-emerald-500',
                  )}
                >
                  Status orientação:{' '}
                  <strong>
                    {' '}
                    {!work.solicitacao_aceita && !work.data_reprovacao
                      ? 'Pendente'
                      : !work.solicitacao_aceita && work.data_reprovacao
                        ? 'Recusada'
                        : 'Aceita'}
                  </strong>
                </CardDescription>
                {work.justificativa_reprovacao && (
                  <CardDescription>
                    Justificativa:{' '}
                    <strong>{work.justificativa_reprovacao}</strong>
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex justify-between">
              <p>
                Total de atividades: <strong className="text-primary">0</strong>
              </p>
              <a
                className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => handleViewProjects(work.id_orientacao)}
              >
                Visualizar trabalho
              </a>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
