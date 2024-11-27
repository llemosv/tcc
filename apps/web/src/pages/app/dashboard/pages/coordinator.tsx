import { GuidanceInProgressCard } from '../partials/coorditanor/guidance-in-progress-card'
import { TeacherGuidancesCard } from '../partials/coorditanor/teacher-guidances-card'

export function CoordinatorDashboard() {
  return (
    <div className="grid w-full gap-5 md:grid-cols-2">
      <GuidanceInProgressCard />
      <TeacherGuidancesCard />
    </div>
  )
}
