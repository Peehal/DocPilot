import { FileText, Users, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { label: 'My Documents', icon: FileText, active: true },
  { label: 'Recent', icon: Clock, active: false },
  { label: 'Shared with me', icon: Users, active: false },
  { label: 'Trash', icon: Trash2, active: false },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r p-3">
      <nav className="flex flex-col gap-0.5">
        {ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={!item.active}
            className={cn(
              'flex items-center gap-3 rounded-full px-4 py-2 text-left text-sm transition-colors',
              item.active
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground/60 cursor-not-allowed'
            )}
          >
            <item.icon size={16} />
            <span className="flex-1">{item.label}</span>
            {!item.active && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                Soon
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}
