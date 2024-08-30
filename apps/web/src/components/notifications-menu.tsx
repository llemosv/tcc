import { Bell, Info } from 'lucide-react'

import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function NotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />
          {/* <ChevronDown className="h-4 w-4" /> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex w-full items-center justify-between p-3">
          <h1 className="font-semibold">Notificações</h1>

          <span className="cursor-pointer text-[0.75rem] text-muted-foreground transition-colors hover:text-foreground">
            Marcar todas como lidas
          </span>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="">
          <button className="flex w-full cursor-pointer items-start gap-4 p-2 text-left">
            <Info className="h-5 w-5 text-primary" />
            <div>
              <span className="w-full  font-semibold">Humberto Melo</span>
              <p className="text-[0.7rem] leading-4 text-muted-foreground">
                Adicionou uma nova observação na tarefa{' '}
                <span className="font-semibold">Revisão de código</span>
              </p>
            </div>
          </button>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="">
          <button className="flex w-full cursor-pointer items-start gap-4 p-2 text-left">
            <Info className="h-5 w-5 text-primary" />
            <div>
              <span className="w-full  font-semibold">Humberto Melo</span>
              <p className="text-[0.7rem] leading-4 text-muted-foreground">
                Adicionou uma nova observação na tarefa{' '}
                <span className="font-semibold">Revisão de código</span>
              </p>
            </div>
          </button>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="">
          <button className="flex w-full cursor-pointer items-center justify-center gap-4 p-2">
            <span className="font-semibold text-primary">Ver todas</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
