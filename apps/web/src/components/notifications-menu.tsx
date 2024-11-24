import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, Info } from 'lucide-react'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

import {
  getPendingNotifications,
  Notification,
} from '@/api/get-pending-notifications'
import { readAllNotifications } from '@/api/read-all-notifications'
import { env } from '@/env'
import { useAuth } from '@/hooks/useAuth'

import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const socket = io(env.VITE_SOCKET_URL, { transports: ['websocket'] })

export function NotificationsMenu() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: notifications } = useQuery({
    queryKey: ['pending-notifications', user?.id],
    queryFn: () => getPendingNotifications(user?.id!),
    enabled: !!user?.id,
  })

  const { mutateAsync: readAll } = useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-notifications'] })
    },
  })

  useEffect(() => {
    const handleNotification = (notification: Notification) => {
      console.log('aaqqq', notification)
      console.log('aaqqq', user?.id!)
      if (notification.id_usuario_destinatario === user?.id!) {
        queryClient.setQueryData(
          ['pending-notifications', user?.id!],
          (oldNotifications: Notification[] = []) => [
            ...oldNotifications,
            notification,
          ],
        )
      }
    }

    socket.on('receiveNotification', handleNotification)

    socket.emit('joinNotifications', user?.id)

    return () => {
      socket.off('receiveNotification', handleNotification)
    }
  }, [user?.id, queryClient])

  async function handleReadAllNotifications() {
    if (user?.id) await readAll(user?.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex w-full items-center justify-between p-3">
          <h1 className="font-semibold">Notificações</h1>
          <span
            className="cursor-pointer text-[0.75rem] text-muted-foreground transition-colors hover:text-foreground"
            onClick={handleReadAllNotifications}
          >
            Marcar todas como lidas
          </span>
        </div>

        <DropdownMenuSeparator />
        {notifications && notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <DropdownMenuItem key={index} asChild>
              <button className="flex w-full cursor-pointer items-start gap-4 p-2 text-left">
                <Info className="h-5 w-5 text-primary" />
                <div>
                  <span className="w-full font-semibold">
                    {notification.remetente || 'Usuário Anônimo'}
                  </span>
                  <p className="text-[0.7rem] leading-4 text-muted-foreground">
                    {notification.mensagem}
                  </p>
                </div>
              </button>
            </DropdownMenuItem>
          ))
        ) : (
          <p className="p-4 text-muted-foreground">Nenhuma notificação nova</p>
        )}

        {/* <DropdownMenuSeparator /> */}

        {/* <DropdownMenuItem asChild>
          <button className="flex w-full cursor-pointer items-center justify-center gap-4 p-2">
            <span className="font-semibold text-primary">Ver todas</span>
          </button>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
