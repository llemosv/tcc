import { ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'

import { CreateTaskTopicDialog } from '@/components/create-task-topic-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'

import { TaskTopicsCard } from './partials/task-topics-card'

export function TaskTopics() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { idTcc, idTask } = useParams<{ idTask: string; idTcc: string }>()

  function handleBack() {
    navigate(`/works/${idTcc}`)
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

          <CreateTaskTopicDialog id_task={String(idTask)} />
        </Dialog>
      </div>

      <TaskTopicsCard />
    </>
  )
}
