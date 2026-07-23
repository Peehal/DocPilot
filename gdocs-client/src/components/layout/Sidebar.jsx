import { NavLink } from 'react-router-dom';
import { FileText, LayoutTemplate, Users, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { label: 'My Documents', icon: FileText, to: '/' },
  { label: 'Templates', icon: LayoutTemplate, to: '/templates' },
  { label: 'Recent', icon: Clock },
  { label: 'Shared with me', icon: Users },
  { label: 'Trash', icon: Trash2 },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r p-3">
      <nav className="flex flex-col gap-0.5">
        {ITEMS.map((item) =>
          item.to ? (
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
          ) : (
            <button
              key={item.label}
              type="button"
              disabled
              className="flex cursor-not-allowed items-center gap-3 rounded-full px-4 py-2 text-left text-sm text-muted-foreground/60"
            >
              <item.icon size={16} />
              <span className="flex-1">{item.label}</span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                Soon
              </span>
            </button>
          )
        )}
      </nav>
    </aside>
  );
}
