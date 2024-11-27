import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { concludeTcc } from '@/api/conclude-tcc'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface ConcludeTccDialogProps {
  id_tcc: string
}

export function ConcludeTccDialog({ id_tcc }: ConcludeTccDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: pendingReview, isPending } = useMutation({
    mutationFn: concludeTcc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] })
      toast.success('TCC marcado como concluído.')
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Erro ao atualizar TCC.'

      toast.error(errorMessage)
    },
  })

  async function handleConcludeTcc(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await pendingReview({
      id_tcc,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Concluir trabalho</DialogTitle>
        <DialogDescription>
          Tem certeza que deseja marcar como concluído o trabalho selecionado?
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleConcludeTcc}>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            Concluir
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
