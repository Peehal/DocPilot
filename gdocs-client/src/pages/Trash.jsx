import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Trash2 } from 'lucide-react';
import {
  useDocuments,
  usePermanentlyDeleteDocument,
  useRestoreDocument,
} from '@/hooks/useDocuments';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Loader } from '@/components/shared/Loader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DocumentGrid } from '@/components/documents/DocumentGrid';
import { Button } from '@/components/ui/button';

export default function Trash() {
  const navigate = useNavigate();
  const { data: documents, isLoading, isError, error } = useDocuments('trash');
  const restoreDocument = useRestoreDocument();
  const permanentlyDeleteDocument = usePermanentlyDeleteDocument();
  const [docToPurge, setDocToPurge] = useState(null);

  const handlePurge = async () => {
    await permanentlyDeleteDocument.mutateAsync(docToPurge._id);
    setDocToPurge(null);
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />

        <div className="min-w-0 flex-1 p-4 sm:p-8">
          <h1 className="mb-6 text-2xl font-semibold">Trash</h1>

          {isLoading && <Loader />}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load trash: {error.response?.data?.error || error.message}
            </p>
          )}

          {!isLoading && !isError && documents?.length === 0 && (
            <EmptyState
              title="Trash is empty"
              description="Documents you delete will show up here until permanently removed."
            />
          )}

          {!isLoading && !isError && documents?.length > 0 && (
            <DocumentGrid
              documents={documents}
              onOpen={(doc) => navigate(`/documents/${doc._id}`)}
              dateLabel="Deleted"
              dateField="deletedAt"
              renderActions={(doc) => (
                <>
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    className="shadow"
                    title="Restore"
                    onClick={() => restoreDocument.mutate(doc._id)}
                  >
                    <RotateCcw size={14} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    className="shadow"
                    title="Delete forever"
                    onClick={() => setDocToPurge(doc)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </>
              )}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(docToPurge)}
        onOpenChange={(open) => !open && setDocToPurge(null)}
        title="Delete forever?"
        description={`"${docToPurge?.title}" will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete forever"
        onConfirm={handlePurge}
        isLoading={permanentlyDeleteDocument.isPending}
      />
    </div>
  );
}
