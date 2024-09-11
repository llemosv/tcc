import { Helmet } from 'react-helmet-async'

import { useAuth } from '@/hooks/useAuth'

import { CoordinatorDashboard } from './pages/coordinator'
import { StudentDashboard } from './pages/student'
import { TeacherDashboard } from './pages/teacher'

export function Dashboard() {
  const { user } = useAuth()
  console.log(user)
  return (
    <>
      <Helmet title="Dashboard" />
      <h3 className="pb-2 text-2xl font-semibold leading-none tracking-tight">
        Dashboard
      </h3>
      {user?.tipo_pessoa === '57e83fe5-bd2c-4473-bebc-b5de48095b32' && (
        <CoordinatorDashboard />
      )}
      {user?.tipo_pessoa === 'b6a95883-9949-4d23-b220-1f3af6c8f7ea' && (
        <TeacherDashboard />
      )}
      {user?.tipo_pessoa === '842b617d-0558-4d48-89bc-a1b53f1c3c87' && (
        <StudentDashboard />
      )}
    </>
  )
}
