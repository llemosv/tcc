import { useQuery } from '@tanstack/react-query'
import { Link } from 'lucide-react'

import { getPendingGuidances } from '@/api/get-pending-guidances'
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

import { CardSkeleton } from '../card-skeleton'

export function PendingGuidancesCard() {
  const { user } = useAuth()
  const { data: pendingGuidances, isLoading: isLoadingGuidances } = useQuery({
    queryKey: ['pending-guidances'],
    queryFn: () => getPendingGuidances({ id: String(user?.id) }),
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
            {pendingGuidances && pendingGuidances.length > 0 ? (
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
                  {pendingGuidances.map((tcc) => (
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
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button type="button">
                                    <Link className="h-5 w-5" />
                                  </button>
                                </DialogTrigger>
                                <AcceptSolicitationDialog work={tcc} />
                              </Dialog>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Responder solicitação</p>
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
