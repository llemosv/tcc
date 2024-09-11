import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Link } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'

import { getTasks } from '@/api/get-tasks'
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
import { useAuth } from '@/hooks/useAuth'

import { getColor } from '../../../utils/get-color'
import { getStatus } from '../../../utils/get-status'
import { CardSkeleton } from './partials/card-skeleton'

export function Tasks() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()

  const { data: tasks, isLoading: isLoadingGuidances } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => getTasks(id!),
  })

  function handleBack() {
    navigate('/works')
  }

  function handleViewActivity(idActivity: string) {
    navigate(`/works/${id}/topics/${idActivity}`)
  }
  return (
    <>
      <Helmet title="Atividades" />

      <div className="flex items-center justify-between">
        <h3
          className="flex cursor-pointer items-center gap-3 text-xl font-semibold leading-none tracking-tight hover:text-muted-foreground"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
          <p className="hidden md:inline">Voltar</p>
        </h3>

        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Atividades
        </h3>

        <Button
          disabled={
            user?.tipo_pessoa === '842b617d-0558-4d48-89bc-a1b53f1c3c87'
          }
        >
          Cadastrar
        </Button>
      </div>

      {isLoadingGuidances ? (
        <CardSkeleton />
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
                  <TableCell className="cursor-pointer text-left">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
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
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
