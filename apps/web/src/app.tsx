import './global.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { queryClient } from '@/lib/react-query'

import { AuthProvider } from './contexts/AuthContext'
import { Router } from './routes/router'

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="gerenciadortcc::theme">
      <HelmetProvider>
        <Helmet titleTemplate="%s | gerenciador.tcc" />
        <Toaster richColors closeButton />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  )
}
