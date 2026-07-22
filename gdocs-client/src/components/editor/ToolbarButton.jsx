import { cn } from '@/lib/utils';

export function ToolbarButton({ onClick, isActive, disabled, title, children }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:h-4.5 [&_svg]:w-4.5 [&_svg]:stroke-[2.25]',
        isActive && 'bg-muted text-foreground'
      )}
    >
      {children}
    </button>
  );
}
