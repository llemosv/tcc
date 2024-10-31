import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, Info, Trash } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { getTopics } from '@/api/get-task-topics'
import { ConcludeTaskTopicDialog } from '@/components/conclude-task-topic-dialog'
import { PendingReviewTaskTopicDialog } from '@/components/pending-review-task-topic-dialog'
import { RejectionJustificationTaskDialog } from '@/components/rejection-justification-task-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { getColor } from '@/utils/get-color'
import { getStatus } from '@/utils/get-status'
import { getUserType } from '@/utils/get-user-type'

import { CardSkeleton } from './card-skeleton'
import { MessageSheet } from './message-sheet'
import { DeleteTaskTopicDialog } from '@/components/delete-task-topic-dialog'

export function TaskTopicsCard() {
  const { idTask } = useParams<{ idTask: string; idTcc: string }>()

  const [idTopic, setIdTopic] = useState<string | null>(null)

  const { data: taskTopics, isLoading: isLoadingTaskTopics } = useQuery({
    queryKey: ['task-topics', idTask],
    queryFn: () => getTopics(String(idTask)),
  })

  const userType = getUserType()

  function handleOpenMessage(id: string) {
    if (idTopic !== id) {
      setIdTopic(id)
    }
  }
  
  return (
    <>
      {isLoadingTaskTopics ? (
        Array.from({ length: 2 }).map((_, index) => <CardSkeleton key={index} />)
      ) : !taskTopics || taskTopics.length === 0 ? (
        <div className="flex h-[80vh] items-center justify-center">
          <h3 className="text-3xl font-semibold leading-none tracking-tight">
            Nenhum tópico cadastrado
          </h3>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {taskTopics.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="mb-1 flex items-center justify-between">
                  <CardTitle>{item.titulo}</CardTitle>

                  <div className="flex text-center justify-center gap-2">
                  {item.justificativa && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  type="button"
                                  className="cursor-pointer hover:text-primary"
                                >
                                  <Info className="h-5 w-5 hover:cursor-pointer hover:text-primary" />
                                </button>
                              </DialogTrigger>

                              <RejectionJustificationTaskDialog
                                message={item.justificativa}
                              />
                            </Dialog>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Justificativa</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {userType !== 'aluno' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  type="button"
                                  className={cn(
                                    !!item.data_finalizacao ||
                                      !!item.data_pendente_revisao
                                      ? 'cursor-not-allowed text-muted-foreground hover:text-muted-foreground'
                                      : 'cursor-pointer hover:text-red-600'
                                  )}
                                  disabled={!!item.data_finalizacao}
                                >
                                  <Trash className="h-5 w-5" />
                                </button>
                              </DialogTrigger>

                              <DeleteTaskTopicDialog id={item.id} />
                            </Dialog>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir tópico</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                type="button"
                                className={cn(
                                  'text-foreground',
                                  userType === 'aluno'
                                    ? !!item.data_finalizacao ||
                                      !!item.data_pendente_revisao
                                      ? 'cursor-not-allowed text-muted-foreground hover:text-muted-foreground'
                                      : 'cursor-pointer hover:text-green-600'
                                    : !item.data_pendente_revisao ||
                                        !!item.data_finalizacao
                                      ? 'cursor-not-allowed text-muted-foreground hover:text-muted-foreground'
                                      : 'cursor-pointer hover:text-green-600',
                                )}
                                disabled={
                                  userType === 'aluno'
                                    ? !!item.data_finalizacao ||
                                      !!item.data_pendente_revisao
                                    : !item.data_pendente_revisao ||
                                      !!item.data_finalizacao
                                }
                              >
                                <CheckCircle2 className="h-5 w-5" />
                              </button>
                            </DialogTrigger>

                            {userType === 'aluno' ? (
                              <PendingReviewTaskTopicDialog id={item.id} />
                            ) : (
                              <ConcludeTaskTopicDialog id={item.id} />
                            )}
                          </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {userType === 'aluno'
                              ? 'Solicitar revisão atividade'
                              : 'Revisar atividade'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="flex justify-between">
                  <CardDescription>{item.descricao}</CardDescription>
                  <CardDescription>
                    Previsão de entrega:{' '}
                    <span className="font-semibold">
                      {item.previsao_entrega}
                    </span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <h1>
                    Status:{' '}
                    <span
                      className={getColor(
                        item.previsao_entrega,
                        item.data_pendente_revisao,
                        item.data_finalizacao,
                      )}
                    >
                      {getStatus(
                        item.previsao_entrega,
                        item.data_pendente_revisao,
                        item.data_finalizacao,
                      )}
                    </span>
                  </h1>

                  <Sheet>
                    <SheetTrigger asChild>
                      <button
                        className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => handleOpenMessage(item.id)}
                      >
                        Visualizar anotações
                      </button>
                    </SheetTrigger>
                    {idTopic === item.id && (
                      <MessageSheet topic={item} idTopic={idTopic} />
                    )}
                  </Sheet>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
