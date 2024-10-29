import { Helmet } from 'react-helmet-async'

import { useAuth } from '@/hooks/useAuth'

import { StudentWorks } from './pages/student'
import { TeacherWorks } from './pages/teacher'

export function Works() {
  const { user } = useAuth()

  return (
    <>
      <Helmet title="Trabalhos" />

      {/* {user?.tipo_pessoa === 1 && <CoordinatorWorks />} */}
      {user?.tipo_pessoa === 'b6a95883-9949-4d23-b220-1f3af6c8f7ea' && (
        <TeacherWorks />
      )}
      {user?.tipo_pessoa === '842b617d-0558-4d48-89bc-a1b53f1c3c87' && (
        <StudentWorks />
      )}
    </>
  )
  return <></>
}
