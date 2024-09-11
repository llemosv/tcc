import { Home, NotebookText, SquareChartGantt } from 'lucide-react'

import { AccountMenu } from './account-menu'
// import { AccountMenu } from './account-menu'
import { NavLink } from './nav-link'
import { NotificationsMenu } from './notifications-menu'
import { ThemeToggle } from './theme/theme-toggle'
import { Separator } from './ui/separator'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <SquareChartGantt className="hidden h-6 w-6 md:inline" />

        <Separator orientation="vertical" className="hidden h-6 md:inline" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-6 w-6" />
            <p className="hidden md:inline">Dashboard</p>
          </NavLink>

          <NavLink to="/works">
            <NotebookText className="h-6 w-6" />
            <p className="hidden md:inline">Trabalhos</p>
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <NotificationsMenu />
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
