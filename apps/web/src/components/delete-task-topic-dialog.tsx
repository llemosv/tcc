import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteTaskTopic } from '@/api/delete-task-topic'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface DeleteTaskTopicDialogProps {
  id: string
}

export function DeleteTaskTopicDialog({ id }: DeleteTaskTopicDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: deleteTopic, isPending } = useMutation({
    mutationFn: deleteTaskTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-topics'] })
      toast.success('Tópico excluido com sucesso.')
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Erro ao excluir tópico.'

      toast.error(errorMessage)
    },
  })

  async function handleDeleteTaskTopic(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    await deleteTopic({
      id,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Excluir tópico</DialogTitle>
      </DialogHeader>
      <p>Deseja excluir o tópico selecionado?</p>
      <form onSubmit={handleDeleteTaskTopic}>
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
