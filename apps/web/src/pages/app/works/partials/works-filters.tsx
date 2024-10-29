import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const workFiltersSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
})

type WorkFiltersSchema = z.infer<typeof workFiltersSchema>

export function WorkFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const name = searchParams.get('name')
  const status = searchParams.get('status')

  const { register, handleSubmit, control, reset } = useForm<WorkFiltersSchema>(
    {
      resolver: zodResolver(workFiltersSchema),
      defaultValues: {
        name: name ?? '',
        status: status ?? 'all',
      },
    },
  )

  function handleFilter({ name, status }: WorkFiltersSchema) {
    setSearchParams((state) => {
      if (name) {
        state.set('name', name)
      } else {
        state.delete('name')
      }

      if (status) {
        state.set('status', status)
      } else {
        state.delete('status')
      }

      state.set('page', '1')

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('name')
      state.delete('status')
      state.set('page', '1')

      return state
    })

    reset({
      name: '',
      status: 'all',
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>

      <Input
        placeholder="Nome do aluno"
        className="h-8 w-[320px]"
        {...register('name')}
      />
      <Controller
        name="status"
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              defaultValue="all"
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="refused">Recusado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="accepted">Aceito</SelectItem>
              </SelectContent>
            </Select>
          )
        }}
      ></Controller>
      <Button variant="secondary" size="xs" type="submit">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>
      <Button
        onClick={handleClearFilters}
        variant="outline"
        size="xs"
        type="button"
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  )
}
