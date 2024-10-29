import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'

import { getTopics } from '@/api/get-task-topics'
import { CreateTaskTopicDialog } from '@/components/create-task-topic-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/useAuth'

import { getColor } from '../../../utils/get-color'
import { getStatus } from '../../../utils/get-status'
import { CardSkeleton } from './partials/card-skeleton'
import { MessageSheet } from './partials/message-sheet'

export function TaskTopics() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { idTcc, idTask } = useParams<{ idTask: string; idTcc: string }>()
  const [idTopic, setIdTopic] = useState<string | null>(null)

  const { data: taskTopics, isLoading: isLoadingTaskTopics } = useQuery({
    queryKey: ['task-topics', idTask],
    queryFn: () => getTopics(idTask!),
  })

  function handleBack() {
    navigate(`/works/${idTcc}`)
  }

  function handleOpenMessage(id: string) {
    if (idTopic !== id) {
      setIdTopic(id)
    }
  }
  return (
    <>
      <Helmet title="Tópicos" />

      <div className="flex items-center justify-between">
        <h3
          className="flex cursor-pointer items-center gap-3 text-xl font-semibold leading-none tracking-tight hover:text-muted-foreground"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
          <p className="hidden md:inline">Voltar</p>
        </h3>

        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Tópicos
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              disabled={
                user?.tipo_pessoa === '842b617d-0558-4d48-89bc-a1b53f1c3c87'
              }
            >
              Cadastrar
            </Button>
          </DialogTrigger>

          <CreateTaskTopicDialog id_task={idTask!} />
        </Dialog>
      </div>
      {isLoadingTaskTopics ? (
        <>
          <CardSkeleton />
          <CardSkeleton />
        </>
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
                <CardTitle>{item.titulo}</CardTitle>
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
                        item.data_finalizacao,
                      )}
                    >
                      {getStatus(item.previsao_entrega, item.data_finalizacao)}
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
