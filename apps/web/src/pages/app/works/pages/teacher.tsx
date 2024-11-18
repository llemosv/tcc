import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { AcceptSolicitationDialog } from '@/components/accept-solicitation-dialog'
import { AlterThemeTccDialog } from '@/components/alter-theme-tcc-dialog'
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

import { getGuidances } from '../../../../api/get-guidances'
import { CardSkeleton } from '../partials/card-skeleton'
import { WorkFilters } from '../partials/works-filters'

export function TeacherWorks() {
  const userType = getUserType()
  const navigate = useNavigate()
  const [searchParams, _] = useSearchParams()
  const { user } = useAuth()

  const name = searchParams.get('name')
  const status = searchParams.get('status')

  const { data: works, isLoading: isLoadingGuidances } = useQuery({
    queryKey: ['works', user!.id, userType, name, status],
    queryFn: () =>
      getGuidances({
        studentId: user!.id,
        type: userType,
        name,
        status: status === 'all' ? null : status,
      }),
  })

  function handleViewProjects(id: number | string) {
    navigate(`/works/${id}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Trabalhos
        </h3>
      </div>

      <WorkFilters />

      {isLoadingGuidances ? (
        <CardSkeleton />
      ) : works?.length === 0 ? (
        <div className="flex h-[50vh] items-center justify-center">
          <h3 className="text-2xl font-semibold">Nenhum trabalho encontrado</h3>
        </div>
      ) : (
        <>
          {works &&
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
                      Solicitante:{' '}
                      <span className="font-semibold">{work.aluno}</span>
                    </CardDescription>
                    <CardDescription>
                      Previsão de entrega:{' '}
                      <span className="font-semibold">
                        {work.previsao_entrega}
                      </span>
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
                  {!work.solicitacao_aceita && !work.data_reprovacao ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="cursor-pointer  text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:text-muted-foreground/50"
                          disabled={
                            works &&
                            !work.solicitacao_aceita &&
                            work.data_reprovacao !== null
                          }
                        >
                          Responder solicitação
                        </button>
                      </DialogTrigger>

                      <AcceptSolicitationDialog work={work} />
                    </Dialog>
                  ) : (
                    <button
                      className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:text-muted-foreground/50"
                      onClick={() => handleViewProjects(work.id_orientacao)}
                      disabled={!work.solicitacao_aceita}
                    >
                      Visualizar trabalho
                    </button>
                  )}
                </CardContent>
              </Card>
            ))}
        </>
      )}
    </div>
  )
}
