import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function ToolbarDropdown({ label, items }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onMouseDown={(e) => e.preventDefault()}
        className="flex h-8 items-center gap-1 rounded-md px-2 text-sm text-muted-foreground outline-none hover:bg-muted hover:text-foreground"
      >
        {label}
        <ChevronDown size={14} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={item.onClick}
            className={cn(item.isActive && 'bg-muted')}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
