import { Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/pages/_layouts/app'
import { AuthLayout } from '@/pages/_layouts/auth'
import { NotFound } from '@/pages/404'
import { SignIn } from '@/pages/auth/sign-in'

import { authRoutes } from './auth-routes'

export function Router() {
  return (
    <Routes>
      <Route path="/sign-in" element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignIn />} />
      </Route>

      <Route path="/" element={<AppLayout />}>
        {authRoutes.map((routeProps) => (
          <Route key={routeProps.path} {...routeProps} />
        ))}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
