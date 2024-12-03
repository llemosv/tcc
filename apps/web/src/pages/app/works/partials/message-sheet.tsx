import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Paperclip } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { io } from 'socket.io-client'
import { z } from 'zod'

import { Topics } from '@/api/get-task-topics'
import { getTopicFiles } from '@/api/get-topic-files'
import { getMessages, TopicMessage } from '@/api/get-topic-messages'
import { uploadFile } from '@/api/upload-file'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { env } from '@/env'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const socket = io(env.VITE_SOCKET_URL, { transports: ['websocket'] })

interface MessageSheetProps {
  topic: Topics
  idTopic: string
}

const sendMessageSchema = z.object({
  conteudo: z.string().min(1),
})

type SendMessageSchema = z.infer<typeof sendMessageSchema>

export function MessageSheet({ topic, idTopic }: MessageSheetProps) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const { data: topicMessages } = useQuery({
    queryKey: ['topic-message', idTopic],
    queryFn: () => getMessages(idTopic),
    enabled: !!idTopic,
  })
  const { data: topicFiles } = useQuery({
    queryKey: ['topic-files', idTopic],
    queryFn: () => getTopicFiles(idTopic),
    enabled: !!idTopic,
  })

  const { mutateAsync: uploadFileMutation } = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topic-files'] })
    },
    onError: (error) => {
      console.error('Erro ao fazer upload:', error)
    },
  })

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      console.log(file)
      await uploadFileMutation({
        id_topico: idTopic,
        file,
      })
    }
  }

  const { handleSubmit, register, reset } = useForm<SendMessageSchema>({
    resolver: zodResolver(sendMessageSchema),
  })

  useEffect(() => {
    socket.emit('joinTopic', idTopic)

    socket.on('receiveMessage', (newMessage: TopicMessage) => {
      console.log(newMessage)
      if (newMessage.id_topic === idTopic) {
        queryClient.setQueryData(
          ['topic-message', idTopic],
          (oldMessages: TopicMessage[] = []) => [...oldMessages, newMessage],
        )
      }
    })

    return () => {
      socket.off('receiveMessage')
      socket.emit('leaveTopic', idTopic)
    }
  }, [idTopic, queryClient])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [topicMessages])

  async function handleSendMessage(data: SendMessageSchema) {
    const message = {
      id_autor: user?.id!,
      id_topic: topic.id,
      conteudo: data.conteudo,
    }

    socket.emit('sendMessage', message)
    reset()
  }

  return (
    <SheetContent className="flex w-full max-w-[200rem] flex-col">
      <div className="flex-grow scroll-smooth">
        <SheetHeader>
          <SheetTitle>{topic.titulo}</SheetTitle>
          <SheetDescription>{topic.descricao}</SheetDescription>
        </SheetHeader>
        {topicFiles && topicFiles.length > 0 && (
          <div className="mt-4 max-h-12">
            <SheetTitle className="text-sm">Arquivos enviados:</SheetTitle>
            <div className="flex max-h-12 flex-col items-start overflow-auto ">
              {topicFiles.map((file) => (
                <Button
                  key={file.id}
                  variant="link"
                  className=" p-[0.1rem] text-sm"
                  onClick={() => window.open(file.caminho, '_blank')}
                >
                  {file.nome_arquivo}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="no-scrollbar max-h-[50rem] overflow-auto">
        {topicMessages === undefined || topicMessages.length === 0 ? (
          <h3 className="flex h-[42.7rem] items-center justify-center text-2xl font-semibold leading-none tracking-tight">
            Nenhuma anotação enviada
          </h3>
        ) : (
          topicMessages.map((item) => (
            <div
              key={item.id_mensagem}
              className={cn(
                'mt-6 max-w-[70%] rounded-md bg-muted-foreground/10 p-2 first:mt-0',
                user?.id === item.id_autor ? 'ml-auto' : 'mr-auto',
              )}
            >
              <div className="flex justify-between font-semibold">
                <p className="text-sm text-muted-foreground">{item.autor}</p>
                <p className="text-sm text-muted-foreground">
                  {item.data_criacao}
                </p>
              </div>

              <p className="mt-2">{item.conteudo}</p>
            </div>
          ))
        )}
        <div ref={scrollRef} className="h-0" />
      </div>

      <Separator />

      <SheetFooter>
        <form
          onSubmit={handleSubmit(handleSendMessage)}
          className="flex w-full items-center gap-4"
        >
          <Input {...register('conteudo')} autoComplete="off" />
          <button
            type="button"
            onClick={() => document.getElementById('fileInput')?.click()}
            className="flex text-muted-foreground transition-colors hover:text-foreground"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Paperclip />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Anexar arquivo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </button>

          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </form>
      </SheetFooter>
    </SheetContent>
  )
}
