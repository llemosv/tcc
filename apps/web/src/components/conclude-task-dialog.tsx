import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { concludeTask } from '@/api/conclude-task'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface ConcludeTaskDialogProps {
  id: string
}

export function ConcludeTaskDialog({ id }: ConcludeTaskDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: conclude, isPending } = useMutation({
    mutationFn: concludeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Atividade atualizada com sucesso.')
    },
    onError: () => {
      toast.error('Erro ao atualizada atividade.')
    },
  })

  async function handleConcludeTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await conclude({
      id,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Atualizar atividade</DialogTitle>
        <DialogDescription>
          Deseja confirmar a conclusão da atividade selecionada?
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleConcludeTask}>
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
