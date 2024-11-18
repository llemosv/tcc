import { zodResolver } from '@hookform/resolvers/zod'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { updateTccTheme } from '@/api/update-tcc-theme'

// import { alterThemeTcc } from '@/api/conclude-task-topic'
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

interface AlterThemeTccDialogProps {
  id: string
}

const alterThemeTccSchema = z.object({
  theme: z.string().min(5),
})

type AlterThemeTccSchema = z.infer<typeof alterThemeTccSchema>

export function AlterThemeTccDialog({ id }: AlterThemeTccDialogProps) {
  const queryClient = useQueryClient()

  const { handleSubmit, register } = useForm<AlterThemeTccSchema>({
    resolver: zodResolver(alterThemeTccSchema),
    defaultValues: {
      theme: '',
    },
  })

  const { mutateAsync: alter, isPending } = useMutation({
    mutationFn: updateTccTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] })
      toast.success('Tema atualizado com sucesso.')
    },
    onError: () => {
      toast.error('Erro ao atualizar tema.')
    },
  })

  async function handleAlterThemeTcc(data: AlterThemeTccSchema) {
    await alter({
      id,
      theme: data.theme,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Alterar tema</DialogTitle>
        <DialogDescription>Informe um novo tema para o TCC.</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleAlterThemeTcc)}>
        <div className="space-y-5 pb-4 pt-2">
          <div className="grid space-y-2">
            <Label htmlFor="justification">Tema</Label>
            <Textarea
              className="col-span-3"
              id="theme"
              {...register('theme')}
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
