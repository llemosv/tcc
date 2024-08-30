import { useQuery } from '@tanstack/react-query'
import { parse } from 'date-fns'
import { Link } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pie, PieChart } from 'recharts'
import { toast } from 'sonner'

import { getPendingTasks } from '@/api/get-pending-tasks'
import { getTasks, Task } from '@/api/get-tasks'
import { getTasksCount } from '@/api/get-tasks-count'
import { CreateGuidanceSolicitationDialog } from '@/components/create-guidance-solicitation-dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

import {
  getStudentGuidances,
  StudentGuidance,
} from './api/get-student-guidances'
import { CardSkeleton } from './partials/card-skeleton'

const chartConfig = {
  deliveries: {
    label: 'Deliveries',
  },
  overdue: {
    label: 'Em Atraso',
    color: 'hsl(var(--chart-5))',
  },
  pending: {
    label: 'Pendente',
    color: 'hsl(var(--chart-3))',
  },
  concluded: {
    label: 'Entregue',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function StudentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [activeId, setActiveId] = useState<number | null>(null)

  const { data: tccGuidances, isLoading: isLoadingGuidances } = useQuery({
    queryKey: ['works'],
    queryFn: () => getStudentGuidances(user!.id),
  })

  useEffect(() => {
    if (tccGuidances) {
      const activeGuidance = tccGuidances.find(
        (guidance) => guidance.solicitacao_aceita === true,
      )
      if (activeGuidance) {
        setActiveId(activeGuidance.id_orientacao)
      }
    }
  }, [tccGuidances])

  const { data: pendingTasks, isLoading: isLoadingPendingTasks } = useQuery({
    queryKey: ['pending-tasks', activeId],
    queryFn: () => getPendingTasks(activeId!),
    enabled: !!activeId,
  })

  const { data: tasksCalendar, isLoading: isLoadingTasksCalendar } = useQuery({
    queryKey: ['tasks', activeId],
    queryFn: () => getTasks(activeId!),
    enabled: !!activeId,
    select: (data) => {
      return data.map((task) => {
        return {
          date: parse(task.previsao_entrega, 'dd/MM/yyyy', new Date()),
          title: task.tarefa,
          concluded: !!task.data_finalizacao,
        }
      })
    },
  })

  const { data: tasksCount, isLoading: isLoadingTasksCount } = useQuery({
    queryKey: ['tasks-count', activeId],
    queryFn: () => getTasksCount(activeId!),
    enabled: !!activeId,
  })

  function handleViewProjects(tcc: StudentGuidance) {
    if (
      (!tcc.solicitacao_aceita && !!tcc.data_reprovacao) ||
      (!tcc.solicitacao_aceita && !tcc.data_reprovacao)
    ) {
      toast.info('Apenas trabalhos ativos podem ter atividades')
      return
    }
    navigate(`/works/${tcc.id_orientacao}`)
  }

  function getColor(task: Task) {
    const date = parse(task.previsao_entrega, 'dd/MM/yyyy', new Date())

    if (task.data_finalizacao) return 'text-emerald-500 font-semibold'
    if (date < new Date()) return 'text-red-500 font-semibold'
    if (date > new Date()) return 'text-yellow-500 font-semibold'
  }
  return (
    <div className="grid w-full grid-cols-2 gap-5">
      {isLoadingGuidances ? (
        <CardSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Trabalhos em Andamento</CardTitle>
            <CardDescription> Visualize os seus trabalhos</CardDescription>
          </CardHeader>
          <CardContent className="flex">
            {tccGuidances && tccGuidances.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center p-28">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button">Solicitar orientação</Button>
                  </DialogTrigger>

                  <CreateGuidanceSolicitationDialog />
                </Dialog>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orientador</TableHead>
                    <TableHead>Tema</TableHead>
                    <TableHead>Previsão de Entrega</TableHead>
                    <TableHead>Aceito</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tccGuidances &&
                    tccGuidances.map((tcc) => (
                      <TableRow key={tcc.id_orientacao}>
                        <TableCell className="font-medium">
                          {tcc.orientador}
                        </TableCell>
                        <TableCell>{tcc.tema}</TableCell>
                        <TableCell>{tcc.previsao_entrega}</TableCell>
                        <TableCell
                          className={cn(
                            'font-semibold',
                            !tcc.solicitacao_aceita && !tcc.data_reprovacao
                              ? 'text-yellow-500'
                              : !tcc.solicitacao_aceita && tcc.data_reprovacao
                                ? 'text-red-500 dark:text-red-600'
                                : 'text-emerald-500',
                          )}
                        >
                          {!tcc.solicitacao_aceita && !tcc.data_reprovacao
                            ? 'Pendente'
                            : !tcc.solicitacao_aceita && tcc.data_reprovacao
                              ? 'Não'
                              : 'Sim'}
                        </TableCell>
                        <TableCell className="cursor-pointer text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Link
                                  onClick={() => handleViewProjects(tcc)}
                                  className="h-5 w-5"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Visualizar trabalho</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {isLoadingGuidances || isLoadingPendingTasks ? (
        <CardSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
            <CardDescription>
              Visualize as suas tarefas pendentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!pendingTasks ? (
              <div className="flex items-center justify-center p-28">
                <h3 className="text-xl font-semibold">
                  Nenhuma atividade cadastrada
                </h3>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Previsão de Entrega</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        {task.tarefa}
                      </TableCell>
                      <TableCell className={getColor(task)}>
                        {task.previsao_entrega}
                      </TableCell>
                      <TableCell className="cursor-pointer text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Link
                                // onClick={() => handleViewProjects(task)}
                                className="h-5 w-5"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Visualizar tarefa</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {isLoadingGuidances || isLoadingTasksCalendar ? (
        <CardSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Próximas Entregas</CardTitle>
            <CardDescription>
              Não se esqueça de realizar as entregas até o dia combinado com seu
              orientador
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!tasksCalendar ? (
              <div className="flex items-center justify-center p-32">
                <h3 className="text-xl font-semibold">
                  Nenhuma atividade cadastrada
                </h3>
              </div>
            ) : (
              <Calendar events={tasksCalendar} />
            )}
          </CardContent>
        </Card>
      )}

      {isLoadingGuidances || isLoadingTasksCount ? (
        <CardSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Entregas</CardTitle>
            <CardDescription>
              Verifique o andamento das suas entregas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!tasksCount ? (
              <div className="flex items-center justify-center p-32">
                <h3 className="text-xl font-semibold">
                  Nenhuma atividade cadastrada
                </h3>
              </div>
            ) : (
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={tasksCount}
                    dataKey="deliveries"
                    innerRadius={60}
                    label
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="status" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
