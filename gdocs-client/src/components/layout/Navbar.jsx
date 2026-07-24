import { Link } from 'react-router-dom';
import { UserButton, OrganizationSwitcher } from '@clerk/clerk-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Navbar() {
  return (
    <header className="flex items-center justify-between gap-2 border-b px-3 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <Link to="/" className="shrink-0 text-lg font-semibold">
          DocPilot
        </Link>
        <OrganizationSwitcher
          hidePersonal={false}
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"
        />
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <UserButton />
      </div>
    </header>
  );
}
