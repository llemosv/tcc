import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { acceptSolicitation } from '@/api/accept-solicitation'
import { Guidance } from '@/api/get-guidances'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Textarea } from './ui/textarea'

interface AcceptSolicitationProps {
  work: Guidance
}

const acceptSolicitationSchema = z.object({
  accept: z.boolean().default(false),
  justification: z.string(),
})

type AcceptSolicitationSchema = z.infer<typeof acceptSolicitationSchema>

export function AcceptSolicitationDialog({ work }: AcceptSolicitationProps) {
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { isValid },
  } = useForm<AcceptSolicitationSchema>({
    resolver: zodResolver(acceptSolicitationSchema),
    defaultValues: {
      justification: '',
    },
  })

  const { mutateAsync: accept, isPending } = useMutation({
    mutationFn: acceptSolicitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] })
      toast.success('Solicitação respondida com sucesso.')
      reset()
    },
    onError: () => {
      toast.error('Erro ao responder solicitação.')
    },
  })

  async function handleAcceptSolicitation(data: AcceptSolicitationSchema) {
    await accept({
      id_tcc: work.id_orientacao,
      accept: data.accept,
      justification: data.justification,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Responder solicitação para orientação de TCC</DialogTitle>
        <DialogDescription>
          Responda a solicitação do aluno {work.aluno} para orientação do seu
          Trabalho de Conclusão de Curso
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleAcceptSolicitation)}>
        <div className="space-y-5 py-4">
          <div className="grid space-y-2">
            <Controller
              control={control}
              name="accept"
              render={({ field }) => (
                <div className="flex items-center gap-4">
                  <Label htmlFor="accept">Recusar</Label>
                  <Switch
                    id="accept"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="accept">Aceitar</Label>
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
          <Button type="submit" disabled={!isValid || isPending}>
            Enviar resposta
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
