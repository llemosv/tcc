import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createUser } from '@/api/create-user'
import { getCourses } from '@/api/get-courses'
import { getPeopleTypes } from '@/api/get-people-types'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
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
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const createUserSchema = z.object({
  nome: z.string(),
  email: z.string(),
  senha: z.string(),
  cpf: z.string().min(11).max(11),
  id_tipo_pessoa: z.string(),
  id_courses: z.string(),
})

type CreateUserSchema = z.infer<typeof createUserSchema>

export function CreateUserDialog() {
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    register,
    reset,
    control,
    setValue,
    formState: { isValid },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  })

  const { data: peopleTypes } = useQuery({
    queryKey: ['peopleTypes'],
    queryFn: () => getPeopleTypes(),
  })
  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getCourses(),
  })

  const { mutateAsync: create, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('Usuário criado com sucesso.')
      reset()
    },
    onError: () => {
      toast.error('Erro ao criar usuário.')
    },
  })

  async function handleCreateUser(data: CreateUserSchema) {
    console.log(data)
    await create({
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      cpf: data.cpf,
      fl_ativo: true,
      id_tipo_pessoa: data.id_tipo_pessoa,
      id_courses: [data.id_courses],
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar usuário</DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo para cadastrar um novo usuário no sistema
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateUser)}>
        <div className="space-y-4 py-4">
          <div className="grid space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register('nome')} />
          </div>
          <div className="grid space-y-2">
            <Label htmlFor="mail">E-mail</Label>
            <Input id="mail" {...register('email')} />
          </div>
          <div className="grid space-y-2">
            <Label htmlFor="password">Senha Inicial</Label>
            <Input id="password" {...register('senha')} />
          </div>
          <div className="grid space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" {...register('cpf')} />
          </div>
          <div className="grid space-y-2">
            {peopleTypes && (
              <Controller
                control={control}
                name="id_tipo_pessoa"
                render={({ field }) => (
                  <>
                    <Label>Selecione o tipo do usuário</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className=" justify-between"
                        >
                          {field.value
                            ? peopleTypes.find(
                                (peopleType) =>
                                  String(peopleType.id) === field.value,
                              )?.type
                            : 'Selecione o tipo'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[463px] p-0">
                        <Command>
                          <CommandInput placeholder="Pesquisar orientador..." />
                          <CommandList>
                            <CommandEmpty>
                              Nenhum tipo de usuário encontrado.
                            </CommandEmpty>
                            <CommandGroup>
                              {peopleTypes.map((peopleType) => (
                                <CommandItem
                                  key={peopleType.id}
                                  value={String(peopleType.id)}
                                  onSelect={(currentValue) => {
                                    setValue(
                                      'id_tipo_pessoa',
                                      currentValue === field.value
                                        ? ''
                                        : currentValue,
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === String(peopleType.type)
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {peopleType.type}
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
            {courses && (
              <Controller
                control={control}
                name="id_courses"
                render={({ field }) => (
                  <>
                    <Label>Selecione o curso do usuário</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className=" justify-between"
                        >
                          {field.value
                            ? courses.find(
                                (course) => String(course.id) === field.value,
                              )?.type
                            : 'Selecione o curso'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[463px] p-0">
                        <Command>
                          <CommandInput placeholder="Pesquisar orientador..." />
                          <CommandList>
                            <CommandEmpty>
                              Nenhum curso encontrado.
                            </CommandEmpty>
                            <CommandGroup>
                              {courses.map((course) => (
                                <CommandItem
                                  key={course.id}
                                  value={String(course.id)}
                                  onSelect={(currentValue) => {
                                    setValue(
                                      'id_courses',
                                      currentValue === field.value
                                        ? ''
                                        : currentValue,
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === String(course.type)
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {course.type}
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
