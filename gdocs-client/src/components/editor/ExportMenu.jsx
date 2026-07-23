import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { downloadDocumentExport } from '@/lib/export';

const FORMATS = [
  { format: 'pdf', label: 'PDF (.pdf)' },
  { format: 'html', label: 'HTML (.html)' },
  { format: 'txt', label: 'Plain text (.txt)' },
  { format: 'json', label: 'JSON (.json)' },
];

export function ExportMenu({ documentId, title }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await downloadDocumentExport(documentId, title, format);
    } catch (err) {
      console.error('Export failed:', err.response?.data || err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isExporting}
        className="flex h-8 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground outline-none hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        <Download size={14} />
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {FORMATS.map((f) => (
          <DropdownMenuItem key={f.format} onClick={() => handleExport(f.format)}>
            {f.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
