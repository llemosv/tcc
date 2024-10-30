import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { pendingReviewTaskTopic } from '@/api/pending-review-task-topic'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface PendingReviewTaskTopicDialogProps {
  id: string
}

export function PendingReviewTaskTopicDialog({
  id,
}: PendingReviewTaskTopicDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: pendingReviewTopic, isPending } = useMutation({
    mutationFn: pendingReviewTaskTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-topics'] })
      toast.success('Revisão solicitada para a atividade.')
    },
    onError: () => {
      toast.error('Erro ao solicitar revisão.')
    },
  })

  async function handlePendingReviewTaskTopic(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    await pendingReviewTopic({
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

      <form onSubmit={handlePendingReviewTaskTopic}>
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
