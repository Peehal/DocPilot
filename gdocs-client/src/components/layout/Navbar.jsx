import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Navbar() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <Link to="/" className="text-lg font-semibold">
        DocPilot
      </Link>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <UserButton />
      </div>
    </header>
  );
}
