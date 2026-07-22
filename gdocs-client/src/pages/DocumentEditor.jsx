import { useParams } from 'react-router-dom';
import { useDocument, useRenameDocument } from '@/hooks/useDocument';
import { DocHeader } from '@/components/layout/DocHeader';
import { Loader } from '@/components/shared/Loader';

export default function DocumentEditor() {
  const { id } = useParams();
  const { data: document, isLoading } = useDocument(id);
  const renameDocument = useRenameDocument(id);

  if (isLoading) return <Loader />;
  if (!document) return null;

  return (
    <div>
      <DocHeader
        title={document.title}
        onRename={(title) => renameDocument.mutate(title)}
        isSaving={renameDocument.isPending}
      />
      <div className="mx-auto max-w-3xl p-8">
        <div className="flex min-h-[60vh] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          Rich text editor arrives in Phase 2.
        </div>
      </div>
    </div>
  );
}
