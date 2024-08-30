import { RouteProps } from 'react-router-dom'

import { Dashboard } from '@/pages/app/dashboard/'
import { Works } from '@/pages/app/works'
import { WorkDetails } from '@/pages/app/works/work-details'

// import { Orders } from './pages/app/orders/orders'

export const authRoutes: RouteProps[] = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/works',
    element: <Works />,
  },
  {
    path: '/works/:id',
    element: <WorkDetails />,
  },
]
