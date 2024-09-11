import { RouteProps } from 'react-router-dom'

import { Dashboard } from '@/pages/app/dashboard/'
import { Works } from '@/pages/app/works'
import { TaskTopics } from '@/pages/app/works/task-topics'
import { Tasks } from '@/pages/app/works/tasks'

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
    element: <Tasks />,
  },
  {
    path: '/works/:idTcc/topics/:idTask',
    element: <TaskTopics />,
  },
]
