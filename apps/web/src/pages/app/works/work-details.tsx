import { useQuery } from '@tanstack/react-query'
import { parse } from 'date-fns'
import { ArrowLeft, Link } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { getTasks, Task } from '@/api/get-tasks'
import { Button } from '@/components/ui/button'
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

// import { useAuth } from '@/hooks/useAuth'
import { CardSkeleton } from './partials/card-skeleton'

export function WorkDetails() {
  const navigate = useNavigate()
  // const { user } = useAuth()
  const { id } = useParams<{ id: string }>()

  const { data: tasks, isLoading: isLoadingGuidances } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => getTasks(Number(id!)),
  })

  function getStatus(task: Task) {
    const date = parse(task.previsao_entrega, 'dd/MM/yyyy', new Date())

    if (task.data_finalizacao) return 'Entregue'
    if (date < new Date()) return 'Atrasado'
    if (date > new Date()) return 'Pendente'
  }

  function getColor(task: Task) {
    const date = parse(task.previsao_entrega, 'dd/MM/yyyy', new Date())

    if (task.data_finalizacao) return 'text-emerald-500 font-semibold'
    if (date < new Date()) return 'text-red-500 font-semibold'
    if (date > new Date()) return 'text-yellow-500 font-semibold'
  }

  function handleBack() {
    navigate('/works')
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <h3
          className="flex cursor-pointer items-center gap-3 text-xl font-semibold leading-none tracking-tight hover:text-muted-foreground"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </h3>

        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Atividades
        </h3>

        <Button>Cadastrar atividade</Button>
      </div>

      {isLoadingGuidances ? (
        <CardSkeleton />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>Trabalho</TableHead> */}
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
                  <TableCell className={getColor(task)}>
                    {getStatus(task)}
                  </TableCell>
                  <TableCell className="cursor-pointer text-left">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            // onClick={() =>
                            //   handleViewProjects(tcc.id_orientacao)
                            // }
                            className="h-5 w-5 hover:text-primary"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visualizar atividade</p>
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
