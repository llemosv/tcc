import { Helmet } from 'react-helmet-async'

import { useAuth } from '@/hooks/useAuth'

import { StudentWorks } from './pages/student'

export function Works() {
  const { user } = useAuth()

  return (
    <>
      <Helmet title="Trabalhos" />
      <h3 className="pb-2 text-2xl font-semibold leading-none tracking-tight">
        Dashboard
      </h3>
      {/* {user?.tipo_pessoa === 1 && <CoordinatorWorks />}
      {user?.tipo_pessoa === 2 && <TeacherWorks />} */}
      {user?.tipo_pessoa === 3 && <StudentWorks />}
    </>
  )
  return <></>
}
