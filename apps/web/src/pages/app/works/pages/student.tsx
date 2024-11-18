import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { AlterThemeTccDialog } from '@/components/alter-theme-tcc-dialog'
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
import { getUserType } from '@/utils/get-user-type'

import { getGuidances, Guidance } from '../../../../api/get-guidances'
import { CardSkeleton } from '../partials/card-skeleton'

export function StudentWorks() {
  const userType = getUserType()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: works, isLoading: isLoadingGuidances } = useQuery({
    queryKey: ['works'],
    queryFn: () => getGuidances({ studentId: user?.id!, type: userType }),
  })

  function handleViewProjects(id: number | string) {
    navigate(`/works/${id}`)
  }

  function validateSolicitation(works: Guidance[]): boolean {
    return works.some(
      (work) =>
        work.solicitacao_aceita === true ||
        (!work.solicitacao_aceita && !work.data_reprovacao),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Trabalhos
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              disabled={works && validateSolicitation(works)}
            >
              Solicitar orientação
            </Button>
          </DialogTrigger>

          <CreateGuidanceSolicitationDialog />
        </Dialog>
      </div>
      {isLoadingGuidances ? (
        <CardSkeleton />
      ) : works?.length === 0 ? (
        <div className="flex h-[50vh] items-center justify-center">
          <h3 className="text-2xl font-semibold">Nenhum trabalho cadastrado</h3>
        </div>
      ) : (
        works &&
        works.map((work) => (
          <Card key={work.id_orientacao}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{work.tema}</CardTitle>

                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:text-muted-foreground/50"
                      // onClick={() => handleViewProjects(work.id_orientacao)}
                      disabled={!work.solicitacao_aceita}
                    >
                      Alterar tema
                    </button>
                  </DialogTrigger>

                  <AlterThemeTccDialog id={work.id_orientacao} />
                </Dialog>
              </div>
              <div className="flex justify-between">
                <CardDescription>
                  Orientador:{' '}
                  <span className="font-semibold">{work.orientador}</span>
                </CardDescription>
                <CardDescription>
                  Previsão de entrega:{' '}
                  <span className="font-semibold">{work.previsao_entrega}</span>
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
                  <span className="font-semibold">
                    {' '}
                    {!work.solicitacao_aceita && !work.data_reprovacao
                      ? 'Pendente'
                      : !work.solicitacao_aceita && work.data_reprovacao
                        ? 'Recusada'
                        : 'Aceita'}
                  </span>
                </CardDescription>
                {work.justificativa_reprovacao && (
                  <CardDescription>
                    Justificativa:{' '}
                    <span className="font-semibold">
                      {work.justificativa_reprovacao}
                    </span>
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex justify-between">
              <p>
                Total de atividades:{' '}
                <span className="font-semibold text-primary">
                  {work.total_atividades}
                </span>
              </p>
              <button
                className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:text-muted-foreground/50"
                onClick={() => handleViewProjects(work.id_orientacao)}
                disabled={!work.solicitacao_aceita}
              >
                Visualizar trabalho
              </button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
