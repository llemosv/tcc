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

const tasksFiltersSchema = z.object({
  task: z.string().optional(),
  status: z.string().optional(),
})

type TasksFiltersSchema = z.infer<typeof tasksFiltersSchema>

export function TasksFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const task = searchParams.get('task')
  const status = searchParams.get('status')

  const { register, handleSubmit, control, reset } =
    useForm<TasksFiltersSchema>({
      resolver: zodResolver(tasksFiltersSchema),
      defaultValues: {
        task: task ?? '',
        status: status ?? 'all',
      },
    })

  function handleFilter({ task, status }: TasksFiltersSchema) {
    setSearchParams((state) => {
      if (task) {
        state.set('task', task)
      } else {
        state.delete('task')
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
      state.delete('task')
      state.delete('status')
      state.set('page', '1')

      return state
    })

    reset({
      task: '',
      status: 'all',
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="my-2 flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>

      <Input
        placeholder="Tarefa"
        className="h-8 w-[320px]"
        {...register('task')}
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
                <SelectItem value="concluded">Entregue</SelectItem>
                <SelectItem value="delayed">Atrasado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          )
        }}
      />

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
