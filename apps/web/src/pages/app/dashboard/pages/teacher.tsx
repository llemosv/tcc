import { PendingGuidancesCard } from '../partials/teacher/pending-guidances-card'

export function TeacherDashboard() {
  return (
    <div className="grid w-full gap-5 md:grid-cols-2">
      <PendingGuidancesCard />
    </div>
  )
}
