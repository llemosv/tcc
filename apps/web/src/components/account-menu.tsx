import { ChevronDown, LogOut, User } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'

import { CreateUserDialog } from './create-user-dialog'
import { Button } from './ui/button'
import { Dialog, DialogTrigger } from './ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function AccountMenu() {
  const { user, signOut } = useAuth()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex select-none items-center gap-2"
        >
          {user?.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span>{user?.name}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user?.tipo_pessoa === '57e83fe5-bd2c-4473-bebc-b5de48095b32' && (
          <>
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex w-full items-center p-1 ">
                    <User className="mr-2 h-4 w-4" />
                    <span className="text-sm">Criar usuário</span>
                  </button>
                </DialogTrigger>

                <CreateUserDialog />
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem asChild className="text-rose-500 dark:text-rose-400">
          <button className="w-full" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
