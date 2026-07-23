import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function DocHeader({ title, onRename, isSaving }) {
  const [value, setValue] = useState(title);

  useEffect(() => {
    setValue(title);
  }, [title]);

  const commit = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== title) {
      onRename(trimmed);
    } else {
      setValue(title);
    }
  };

  return (
    <header className="flex items-center gap-3 border-b px-6 py-3">
      <Link to="/" className="text-muted-foreground hover:text-foreground">
        <ArrowLeft size={18} />
      </Link>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        className="h-8 max-w-sm border-none px-1 text-base font-medium shadow-none focus-visible:ring-1"
      />
      {isSaving && <span className="text-xs text-muted-foreground">Saving...</span>}
      <div className="ml-auto">
        <NotificationBell />
      </div>
    </header>
  );
}
