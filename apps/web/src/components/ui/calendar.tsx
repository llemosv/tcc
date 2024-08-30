import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Events = {
  date: Date
  title: string
  concluded: boolean
}[]

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  events?: Events
}

function Calendar({
  className,
  classNames,
  events,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const today = new Date()
  const [selectedDayEvents, setSelectedDayEvents] = React.useState<Events>([])

  const isConcludedEvent = (date: Date) => {
    return events
      ? events.some(
          (event) =>
            event.date.toDateString() === date.toDateString() &&
            event.concluded,
        )
      : false
  }

  const isPastEvent = (date: Date) => {
    return events
      ? events.some(
          (event) =>
            event.date.toDateString() === date.toDateString() &&
            !event.concluded &&
            event.date < today,
        )
      : false
  }

  const isFutureEvent = (date: Date) => {
    return events
      ? events.some(
          (event) =>
            event.date.toDateString() === date.toDateString() &&
            event.date >= today,
        )
      : false
  }
  const handleDayClick = (date: Date) => {
    if (events) {
      const dayEvents = events.filter(
        (event) => event.date.toDateString() === date.toDateString(),
      )
      setSelectedDayEvents(dayEvents)
    }
  }
  return (
    <div className="flex gap-4">
      <DayPicker
        locale={ptBR}
        showOutsideDays={showOutsideDays}
        className={cn('p-3', className)}
        classNames={{
          months:
            'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
          month: 'space-y-4',
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'text-sm font-medium',
          nav: 'space-x-1 flex items-center',
          nav_button: cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          ),
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse space-y-1',
          head_row: 'flex',
          head_cell:
            'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2',
          cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
          ),
          day_range_end: 'day-range-end',
          day_selected:
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          day_today: 'bg-accent text-accent-foreground',
          day_outside:
            'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
          day_disabled: 'text-muted-foreground opacity-50',
          day_range_middle:
            'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        modifiers={{
          concludedEvent: isConcludedEvent,
          pastEvent: isPastEvent,
          futureEvent: isFutureEvent,
        }}
        modifiersStyles={{
          concludedEvent: { color: '#28A745' },
          pastEvent: { color: 'red' },
          futureEvent: { color: '#FFBB28' },
        }}
        onDayClick={handleDayClick}
        footer={
          <p className="mt-2 text-sm text-muted-foreground">
            Selecione um dia para ver suas entregas.
          </p>
        }
        {...props}
      />

      {selectedDayEvents.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Entregas para o dia selecionado:</h3>
          <ul>
            {selectedDayEvents.map((event, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                <span className="font-semibold">
                  {event.date.toLocaleDateString()} -{' '}
                </span>
                {event.title} -{' '}
                <span
                  className={cn(
                    'font-semibold text-foreground',
                    isConcludedEvent(event.date) && 'text-emerald-500',
                    isPastEvent(event.date) && 'text-red-500',
                    isFutureEvent(event.date) && 'text-yellow-500',
                  )}
                >
                  {(isConcludedEvent(event.date) && 'Concluído') ||
                    (isPastEvent(event.date) && 'Atrasado') ||
                    (isFutureEvent(event.date) && 'Pendente')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
