import { useQuery } from '@tanstack/react-query'
import { Check, Link } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { getTasks } from '@/api/get-tasks'
import { ConcludeTaskDialog } from '@/components/conclude-task-dialog'
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
import { getColor } from '@/utils/get-color'
import { getStatus } from '@/utils/get-status'

import { CardSkeleton } from './card-skeleton'
import { TasksFilters } from './tasks-table-filters'

export function TasksTable() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { id } = useParams<{ id: string }>()

  const task = searchParams.get('task')
  const status = searchParams.get('status')

  const { data: tasks, isLoading: isLoadingGuidances } = useQuery({
    queryKey: ['tasks', id, task, status],
    queryFn: () =>
      getTasks({
        idTask: id!,
        taskName: task,
        status: status === 'all' ? null : status,
      }),
  })

  function handleViewActivity(idActivity: string) {
    navigate(`/works/${id}/topics/${idActivity}`)
  }
  return (
    <>
      <TasksFilters />

      {isLoadingGuidances ? (
        <CardSkeleton />
      ) : tasks?.length === 0 ? (
        <div className="flex h-[50vh] items-center justify-center">
          <h3 className="text-2xl font-semibold">
            Nenhuma atividade encontrada
          </h3>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarefa</TableHead>
              <TableHead>Início atividade</TableHead>
              <TableHead>Previsão de Entrega</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks &&
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.tarefa}</TableCell>
                  <TableCell>{task.data_criacao}</TableCell>
                  <TableCell>{task.previsao_entrega}</TableCell>
                  <TableCell
                    className={getColor(
                      task.previsao_entrega,
                      task.data_finalizacao,
                    )}
                  >
                    {getStatus(task.previsao_entrega, task.data_finalizacao)}
                  </TableCell>
                  <TableCell className="flex cursor-pointer items-center gap-2 text-left">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            onClick={() => handleViewActivity(task.id)}
                            className="h-5 w-5 hover:text-primary"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visualizar atividade</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                type="button"
                                className={`text-foreground ${task.data_finalizacao ? 'cursor-default text-muted-foreground' : 'cursor-pointer hover:text-green-600'}`}
                                disabled={!!task.data_finalizacao}
                              >
                                <Check />
                              </button>
                            </DialogTrigger>

                            <ConcludeTaskDialog id={task.id} />
                          </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Marcar como concluído</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
