import { useState } from 'react';
import { Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FIELDS = [
  { key: 'top', label: 'Top' },
  { key: 'bottom', label: 'Bottom' },
  { key: 'left', label: 'Left' },
  { key: 'right', label: 'Right' },
];

export function MarginControls({ margins, onChange }) {
  const [open, setOpen] = useState(false);

  const handleFieldChange = (key, value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return;
    onChange({ ...margins, [key]: numeric });
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
        <Ruler size={14} />
        Margins
      </Button>

      {open && (
        <div className="absolute right-0 top-9 z-10 grid w-56 grid-cols-2 gap-3 rounded-lg border bg-popover p-4 shadow-md">
          {FIELDS.map((field) => (
            <label key={field.key} className="flex flex-col gap-1 text-xs text-muted-foreground">
              {field.label}
              <Input
                type="number"
                min={0}
                max={300}
                value={margins[field.key]}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className="h-7 text-sm"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
