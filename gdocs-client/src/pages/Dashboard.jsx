import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '@clerk/clerk-react';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateDocument, useDeleteDocument, useDocuments } from '@/hooks/useDocuments';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Loader } from '@/components/shared/Loader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DocumentGrid } from '@/components/documents/DocumentGrid';
import { Button } from '@/components/ui/button';

export default function Dashboard({ scope = 'mine' }) {
  const navigate = useNavigate();
  const { organization } = useOrganization();
  const { data: documents, isLoading, isError, error } = useDocuments(scope);
  const createDocument = useCreateDocument();
  const deleteDocument = useDeleteDocument();
  const [docToDelete, setDocToDelete] = useState(null);

  const canCreate = scope === 'mine';
  const heading =
    scope === 'shared'
      ? 'Shared with me'
      : scope === 'recent'
        ? 'Recent'
        : organization
          ? `${organization.name} Documents`
          : 'My Documents';

  const handleCreate = async () => {
    try {
      const doc = await createDocument.mutateAsync();
      navigate(`/documents/${doc._id}`);
    } catch (err) {
      console.error('Failed to create document:', err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    await deleteDocument.mutateAsync(docToDelete._id);
    setDocToDelete(null);
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />

        <div className="min-w-0 flex-1 p-4 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{heading}</h1>
            {canCreate && (
              <Button onClick={handleCreate} disabled={createDocument.isPending}>
                <Plus size={16} />
                New document
              </Button>
            )}
          </div>

          {isLoading && <Loader />}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load documents: {error.response?.data?.error || error.message}
            </p>
          )}

          {!isLoading && !isError && documents?.length === 0 && (
            <EmptyState
              title={scope === 'shared' ? 'Nothing shared with you yet' : 'No documents yet'}
              description={
                canCreate
                  ? 'Create your first document to get started.'
                  : 'Documents others share with you will show up here.'
              }
              action={
                canCreate && (
                  <Button onClick={handleCreate} disabled={createDocument.isPending}>
                    <Plus size={16} />
                    New document
                  </Button>
                )
              }
            />
          )}

          {!isLoading && !isError && documents?.length > 0 && (
            <DocumentGrid
              documents={documents}
              onOpen={(doc) => navigate(`/documents/${doc._id}`)}
              renderActions={
                canCreate
                  ? (doc) => (
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        className="shadow"
                        onClick={() => setDocToDelete(doc)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )
                  : undefined
              }
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(docToDelete)}
        onOpenChange={(open) => !open && setDocToDelete(null)}
        title="Delete document?"
        description={`"${docToDelete?.title}" will be moved to Trash.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={deleteDocument.isPending}
      />
    </div>
  );
}
