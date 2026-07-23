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
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const { organization } = useOrganization();
  const { data: documents, isLoading, isError, error } = useDocuments();
  const createDocument = useCreateDocument();
  const deleteDocument = useDeleteDocument();
  const [docToDelete, setDocToDelete] = useState(null);

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

        <div className="min-w-0 flex-1 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              {organization ? `${organization.name} Documents` : 'My Documents'}
            </h1>
            <Button onClick={handleCreate} disabled={createDocument.isPending}>
              <Plus size={16} />
              New document
            </Button>
          </div>

          {isLoading && <Loader />}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load documents: {error.response?.data?.error || error.message}
            </p>
          )}

          {!isLoading && !isError && documents?.length === 0 && (
            <EmptyState
              title="No documents yet"
              description="Create your first document to get started."
              action={
                <Button onClick={handleCreate} disabled={createDocument.isPending}>
                  <Plus size={16} />
                  New document
                </Button>
              }
            />
          )}

          {!isLoading && !isError && documents?.length > 0 && (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/documents/${doc._id}`)}
                >
                  <div className="relative aspect-3/4 overflow-hidden rounded-md border bg-white shadow-sm transition-shadow group-hover:shadow-md">
                    <div className="absolute inset-0 flex flex-col gap-1.5 p-4">
                      <div className="h-2 w-3/4 rounded-full bg-neutral-200" />
                      <div className="h-2 w-full rounded-full bg-neutral-100" />
                      <div className="h-2 w-full rounded-full bg-neutral-100" />
                      <div className="h-2 w-5/6 rounded-full bg-neutral-100" />
                      <div className="mt-3 h-2 w-full rounded-full bg-neutral-100" />
                      <div className="h-2 w-2/3 rounded-full bg-neutral-100" />
                    </div>

                    <Button
                      variant="secondary"
                      size="icon-sm"
                      className="absolute right-2 top-2 opacity-0 shadow transition-opacity group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDocToDelete(doc);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  <div className="mt-2 space-y-0.5">
                    <p className="truncate text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(doc.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(docToDelete)}
        onOpenChange={(open) => !open && setDocToDelete(null)}
        title="Delete document?"
        description={`"${docToDelete?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={deleteDocument.isPending}
      />
    </div>
  );
}
