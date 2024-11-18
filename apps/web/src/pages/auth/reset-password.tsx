import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Stepper } from '@/components/stepper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { updatePassword } from './api/update-password'
import { validateUser } from './api/validate-user'

const step1Schema = z.object({
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  email: z.string().email('E-mail inválido'),
})

const step2Schema = z
  .object({
    novaSenha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  })

type Step1Form = z.infer<typeof step1Schema>
type Step2Form = z.infer<typeof step2Schema>

const Step1 = ({ onNextStep }: { onNextStep: (data: Step1Form) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
  })

  return (
    <form onSubmit={handleSubmit(onNextStep)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input id="cpf" type="text" {...register('cpf')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" {...register('email')} />
      </div>
      <Button
        type="submit"
        className="mt-4 w-full"
        disabled={!isValid || isSubmitting}
      >
        Próximo
      </Button>
    </form>
  )
}

const Step2 = ({ onSubmit }: { onSubmit: (data: Step2Form) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      autoComplete="off"
    >
      <div className="space-y-2">
        <Label htmlFor="novaSenha">Nova Senha</Label>
        <Input
          id="novaSenha"
          type="password"
          {...register('novaSenha')}
          autoComplete="new-password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
        <Input
          id="confirmarSenha"
          type="password"
          {...register('confirmarSenha')}
          autoComplete="new-password"
        />
      </div>
      <Button
        type="submit"
        className="mt-4 w-full"
        disabled={!isValid || isSubmitting}
      >
        Alterar Senha
      </Button>
    </form>
  )
}

const Step3 = () => {
  const navigate = useNavigate()

  function handleBack() {
    navigate('/sign-in')
  }

  return (
    <div className="flex flex-col justify-center gap-6 p-5 text-center">
      <h1 className="text-xl font-medium">Senha alterada com sucesso!</h1>

      <Button type="button" variant="outline" onClick={handleBack}>
        Voltar para o login
      </Button>
    </div>
  )
}

export function ResetPassword() {
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null)

  const steps = ['Verificação', 'Alterar', 'Concluído']

  const { mutateAsync: validate } = useMutation({
    mutationFn: validateUser,
    onSuccess: () => {
      setStep(2)
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    },
  })

  const { mutateAsync: update } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      setStep(3)
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    },
  })
  async function handleStep1(data: Step1Form) {
    console.log('Verificando email e CPF:', data)
    await validate({
      cpf: data.cpf,
      email: data.email,
    })

    setStep1Data(data)
  }

  async function handleStep2(data: Step2Form) {
    if (step1Data) {
      await update({
        cpf: step1Data?.cpf,
        email: step1Data?.email,
        password: data.confirmarSenha,
      })
    }
  }

  return (
    <>
      <Helmet title="Esqueci minha senha" />
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight">
            Alterar Senha
          </h1>

          <Stepper steps={steps} currentStep={step} />

          {step === 1 ? (
            <Step1 key="step1" onNextStep={handleStep1} />
          ) : step === 2 ? (
            <Step2 key="step2" onSubmit={handleStep2} />
          ) : (
            <Step3 key="step3" />
          )}
        </div>
      </div>
    </>
  )
}
