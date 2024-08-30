import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { creteGuidanceSolicitation } from '@/api/create-guidance-solicitation'
import { getTeachers } from '@/api/get-teachers'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

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
import { Textarea } from './ui/textarea'

const createGuidanceSolicitationSchema = z.object({
  id_professor_orientador: z.string().min(1),
  tema: z.string().min(5),
  previsao_entrega: z.string(),
})

type CreateGuidanceSolicitationSchema = z.infer<
  typeof createGuidanceSolicitationSchema
>

export function CreateGuidanceSolicitationDialog() {
  const queryClient = useQueryClient()

  const { user } = useAuth()

  const { data: teachers } = useQuery({
    queryKey: ['teachers', user!.id_curso],
    queryFn: () => getTeachers(user!.id_curso),
  })

  const {
    handleSubmit,
    register,
    control,
    setValue,
    reset,
    formState: { isValid },
  } = useForm<CreateGuidanceSolicitationSchema>({
    resolver: zodResolver(createGuidanceSolicitationSchema),
    defaultValues: {
      previsao_entrega: format(addDays(new Date(), +30), 'yyyy-MM-dd'),
    },
  })

  const { mutateAsync: create, isPending } = useMutation({
    mutationFn: creteGuidanceSolicitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] })
      toast.success('Solicitação criada com sucesso.')
      reset()
    },
    onError: () => {
      toast.error('Erro ao criar solicitação.')
    },
  })

  async function handleCreateGuidanceSolicitation(
    data: CreateGuidanceSolicitationSchema,
  ) {
    await create({
      id_aluno_solicitante: user?.id!,
      id_professor_orientador: Number(data.id_professor_orientador),
      previsao_entrega: data.previsao_entrega,
      solicitacao_aceita: false,
      tema: data.tema,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Solicitar orientação para TCC</DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo para enviar uma solicitação de orientação
          para seu Trabalho de Conclusão de Curso
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateGuidanceSolicitation)}>
        <div className="space-y-4 py-4">
          <div className="grid space-y-2">
            {teachers && (
              <Controller
                control={control}
                name="id_professor_orientador"
                render={({ field }) => (
                  <>
                    <Label>
                      Selecione um professor para ser seu orientador
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className=" justify-between"
                        >
                          {field.value
                            ? teachers.find(
                                (teacher) => String(teacher.id) === field.value,
                              )?.nome
                            : 'Selecione um orientador'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[463px] p-0">
                        <Command>
                          <CommandInput placeholder="Pesquisar orientador..." />
                          <CommandList>
                            <CommandEmpty>
                              Nenhum orientador encontrado.
                            </CommandEmpty>
                            <CommandGroup>
                              {teachers.map((teacher) => (
                                <CommandItem
                                  key={teacher.id}
                                  value={String(teacher.id)}
                                  onSelect={(currentValue) => {
                                    setValue(
                                      'id_professor_orientador',
                                      currentValue === field.value
                                        ? ''
                                        : currentValue,
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === String(teacher.nome)
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {teacher.nome}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </>
                )}
              />
            )}
          </div>

          <div className="grid space-y-2">
            <Label htmlFor="estimated-completion">Previsão de conclusão</Label>
            <Input
              id="estimated-completion"
              type="date"
              {...register('previsao_entrega')}
            />
          </div>

          <div className="grid space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Textarea className="col-span-3" id="theme" {...register('tema')} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={!isValid || isPending}>
            Enviar solicitação
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
