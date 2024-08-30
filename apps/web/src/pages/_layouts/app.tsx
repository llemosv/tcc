import { isAxiosError } from 'axios'
import { useLayoutEffect } from 'react'
import { Navigate, useNavigate, useOutlet } from 'react-router-dom'

import { Header } from '@/components/header'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/axios'

export function AppLayout() {
  const { user, token, signOut } = useAuth()
  const navigate = useNavigate()
  const outlet = useOutlet()

  if (!user && !token) {
    return <Navigate to="/sign-in" />
  }

  useLayoutEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status
          if (status === 401) {
            signOut()
          }
        }

        return Promise.reject(error)
      },
    )
    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">{outlet}</div>
    </div>
  )
}
