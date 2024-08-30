import { AxiosError } from 'axios'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'

const signInForm = z.object({
  email: z.string().email(),
  senha: z.string().min(4),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<SignInForm>()

  async function handleSignIn(data: SignInForm) {
    try {
      await signIn({ email: data.email, senha: data.senha })
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || 'Erro ao acessar o painel'
        toast.error(errorMessage)
      } else {
        toast.error('Erro ao acessar o painel')
      }
    }
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <div className="flex w-[340px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe os seus Trabalhos de Conclusão de Curso!
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleSignIn)}
            className="flex flex-col gap-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" {...register('senha')} />
            </div>

            <Button type="submit" disabled={!isValid || isSubmitting}>
              Acessar
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
