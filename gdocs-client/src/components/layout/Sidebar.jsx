import { NavLink } from 'react-router-dom';
import { FileText, LayoutTemplate, Users, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { label: 'My Documents', icon: FileText, to: '/' },
  { label: 'Templates', icon: LayoutTemplate, to: '/templates' },
  { label: 'Recent', icon: Clock, to: '/recent' },
  { label: 'Shared with me', icon: Users, to: '/shared' },
  { label: 'Trash', icon: Trash2, to: '/trash' },
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r p-3 sm:block">
      <nav className="flex flex-col gap-0.5">
        {ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-full px-4 py-2 text-sm transition-colors hover:bg-muted',
                isActive ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground'
              )
            }
          >
            <item.icon size={16} />
            <span className="flex-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
