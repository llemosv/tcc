import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createTask } from '@/api/create-task'

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

const createTaskSchema = z.object({
  tarefa: z.string().min(3),
  data_criacao: z.string().min(5),
  previsao_entrega: z.string(),
})

type CreateTaskSchema = z.infer<typeof createTaskSchema>

interface CreateTaskDialogProps {
  id_tcc: string
}

export function CreateTaskDialog({ id_tcc }: CreateTaskDialogProps) {
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    register,
    reset,
    formState: { isValid },
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      data_criacao: format(new Date(), 'yyyy-MM-dd'),
      previsao_entrega: format(addDays(new Date(), +15), 'yyyy-MM-dd'),
    },
  })

  const { mutateAsync: create, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Atividade criada com sucesso.')
      reset()
    },
    onError: () => {
      toast.error('Erro ao criar atividade.')
    },
  })

  async function handleCreateTask(data: CreateTaskSchema) {
    await create({
      id_tcc,
      tarefa: data.tarefa,
      data_criacao: data.data_criacao,
      previsao_entrega: data.previsao_entrega,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar atividade</DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo para cadastrar uma atividade no TCC
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateTask)}>
        <div className="space-y-4 py-4">
          <div className="grid space-y-2">
            <Label htmlFor="task">Descrição</Label>
            <Input id="task" {...register('tarefa')} />
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
