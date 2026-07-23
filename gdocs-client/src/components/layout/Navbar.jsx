import { Link } from 'react-router-dom';
import { UserButton, OrganizationSwitcher } from '@clerk/clerk-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Navbar() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-semibold">
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
