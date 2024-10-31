import { PendingGuidancesCard } from '../partials/teacher/pending-guidances-card'
import { TasksPendingApprovalCard } from '../partials/teacher/tasks-pending-approval-card'

export function TeacherDashboard() {
  return (
    <div className="grid w-full gap-5 md:grid-cols-2">
      <PendingGuidancesCard />

      <TasksPendingApprovalCard />
    </div>
  )
}
