import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { pendingReviewTask } from '@/api/pending-review-task'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface PendingReviewTaskDialogProps {
  id: string
}

export function PendingReviewTaskDialog({ id }: PendingReviewTaskDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: pendingReview, isPending } = useMutation({
    mutationFn: pendingReviewTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Revisão solicitada para a atividade.')
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Erro ao solicitar revisão.'

      toast.error(errorMessage)
    },
  })

  async function handlePendingReviewTask(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    await pendingReview({
      id,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Atualizar atividade</DialogTitle>
        <DialogDescription>
          Deseja solicitar a revisão do orientador para concluir a atividade
          selecionada?
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handlePendingReviewTask}>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            Solicitar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
