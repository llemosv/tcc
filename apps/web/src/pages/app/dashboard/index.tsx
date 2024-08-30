import { Helmet } from 'react-helmet-async'

import { useAuth } from '@/hooks/useAuth'

import { CoordinatorDashboard } from './pages/coordinator/coordinator-dashboard'
import { StudentDashboard } from './pages/student/student-dashboard'
import { TeacherDashboard } from './pages/teacher/teacher-dashboard'

export function Dashboard() {
  const { user } = useAuth()

  return (
    <>
      <Helmet title="Dashboard" />
      <h3 className="pb-2 text-2xl font-semibold leading-none tracking-tight">
        Dashboard
      </h3>
      {user?.tipo_pessoa === 1 && <CoordinatorDashboard />}
      {user?.tipo_pessoa === 2 && <TeacherDashboard />}
      {user?.tipo_pessoa === 3 && <StudentDashboard />}
    </>
  )
}
