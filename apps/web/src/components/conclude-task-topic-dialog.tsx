import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { concludeTaskTopic } from '@/api/conclude-task-topic'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Textarea } from './ui/textarea'

interface ConcludeTaskTopicDialogProps {
  id: string
}

const concludeTaskTopicSchema = z.object({
  accept: z.boolean().default(false),
  justification: z.string(),
})

type ConcludeTaskTopicSchema = z.infer<typeof concludeTaskTopicSchema>

export function ConcludeTaskTopicDialog({ id }: ConcludeTaskTopicDialogProps) {
  const queryClient = useQueryClient()

  const { handleSubmit, register, control } = useForm<ConcludeTaskTopicSchema>({
    resolver: zodResolver(concludeTaskTopicSchema),
    defaultValues: {
      justification: '',
    },
  })

  const { mutateAsync: concludeTopic, isPending } = useMutation({
    mutationFn: concludeTaskTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Atividade atualizada com sucesso.')
    },
    onError: () => {
      toast.error('Erro ao atualizada atividade.')
    },
  })

  async function handleConcludeTaskTopic(data: ConcludeTaskTopicSchema) {
    await concludeTopic({
      id,
      conclude: data.accept,
      justification: data.justification,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Finalizar atividade</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleConcludeTaskTopic)}>
        <div className="space-y-5 pb-4 pt-2">
          <div className="grid space-y-2">
            <Label htmlFor="accept">
              Deseja confirmar a conclusão do tópico selecionado?
            </Label>
            <Controller
              control={control}
              name="accept"
              render={({ field }) => (
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">Não</p>
                  <Switch
                    id="accept"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <p className="text-sm font-medium">Sim</p>
                </div>
              )}
            />
          </div>

          <div className="grid space-y-2">
            <Label htmlFor="justification">Justificativa (opcional)</Label>
            <Textarea
              className="col-span-3"
              id="justification"
              {...register('justification')}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            Atualizar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
