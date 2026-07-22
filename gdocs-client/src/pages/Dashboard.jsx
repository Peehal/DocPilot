import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useCreateDocument, useDeleteDocument, useDocuments } from '@/hooks/useDocuments';
import { Navbar } from '@/components/layout/Navbar';
import { Loader } from '@/components/shared/Loader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const navigate = useNavigate();
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
      <div className="mx-auto max-w-5xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Documents</h1>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <Card
                key={doc._id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => navigate(`/documents/${doc._id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText size={16} className="shrink-0 text-muted-foreground" />
                    <span className="truncate">{doc.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Updated {new Date(doc.updatedAt).toLocaleDateString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDocToDelete(doc);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
