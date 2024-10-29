import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createTopic } from '@/api/create-topic'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

const createTaskTopicSchema = z.object({
  titulo: z.string().min(3),
  descricao: z.string().min(3),
  data_criacao: z.string().min(5),
  previsao_entrega: z.string(),
})

type CreateTaskTopicSchema = z.infer<typeof createTaskTopicSchema>

interface CreateTaskTopicDialogProps {
  id_task: string
}

export function CreateTaskTopicDialog({ id_task }: CreateTaskTopicDialogProps) {
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    register,
    reset,
    formState: { isValid },
  } = useForm<CreateTaskTopicSchema>({
    resolver: zodResolver(createTaskTopicSchema),
    defaultValues: {
      data_criacao: format(new Date(), 'yyyy-MM-dd'),
      previsao_entrega: format(addDays(new Date(), +7), 'yyyy-MM-dd'),
    },
  })

  const { mutateAsync: create, isPending } = useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-topics'] })
      toast.success('Tópico criado com sucesso.')
      reset()
    },
    onError: () => {
      toast.error('Erro ao criar tópico.')
    },
  })

  async function handleCreateTaskTopic(data: CreateTaskTopicSchema) {
    await create({
      id_task,
      titulo: data.titulo,
      descricao: data.descricao,
      data_criacao: data.data_criacao,
      previsao_entrega: data.previsao_entrega,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar tópico</DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo para cadastrar um novo tópico para a
          atividade
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateTaskTopic)}>
        <div className="space-y-4 py-4">
          <div className="grid space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" {...register('titulo')} />
          </div>
          <div className="grid space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input id="descricao" {...register('descricao')} />
          </div>

          <div className="grid space-y-2">
            <Label htmlFor="estimated-completion">Previsão de conclusão</Label>
            <Input
              id="estimated-completion"
              type="date"
              {...register('previsao_entrega')}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={!isValid || isPending}>
            Cadastrar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
