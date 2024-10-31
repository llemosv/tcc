import { useQuery } from '@tanstack/react-query'
import { isBefore, parse, startOfDay } from 'date-fns'
import { Link } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getTasksPendingApproval } from '@/api/get-tasks-pending-approval'
import { AcceptSolicitationDialog } from '@/components/accept-solicitation-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { getColor } from '@/utils/get-color'

import { CardSkeleton } from '../card-skeleton'

export function TasksPendingApprovalCard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: tasksPendingApproval, isLoading: isLoadingGuidances } =
    useQuery({
      queryKey: ['tasks-pending-approval'],
      queryFn: () => getTasksPendingApproval({ idProfessor: String(user?.id) }),
    })

  const actualDate = startOfDay(new Date())

  function handleViewActivities(id_tcc: string) {
    navigate(`/works/${id_tcc}`)
  }
  return (
    <>
      {isLoadingGuidances ? (
        <CardSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Atividades pendentes de aprovação</CardTitle>
            <CardDescription>
              Solicitações para aprovação de atividade
            </CardDescription>
          </CardHeader>
          <CardContent className="flex">
            {tasksPendingApproval && tasksPendingApproval.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atividade</TableHead>
                    <TableHead>Solicitação Revisão</TableHead>
                    <TableHead>Previsão de Entrega</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasksPendingApproval.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        {task.tarefa}
                      </TableCell>
                      <TableCell>{task.solicitacao_revisao}</TableCell>
                      <TableCell
                        className={cn(
                          isBefore(
                            parse(
                              task.previsao_entrega,
                              'dd/MM/yyyy',
                              new Date(),
                            ),
                            actualDate,
                          )
                            ? 'text-red-600' // Vermelho se a previsão for anterior à data atual
                            : 'text-yellow-500', // Amarelo caso contrário
                        )}
                      >
                        {task.previsao_entrega}
                      </TableCell>

                      <TableCell className="cursor-pointer text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Link
                                    className="h-5 w-5"
                                    onClick={() =>
                                      handleViewActivities(task.id_tcc)
                                    }
                                  />
                                </DialogTrigger>
                                {/* <AcceptSolicitationDialog work={task} /> */}
                              </Dialog>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ir para atividades</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
