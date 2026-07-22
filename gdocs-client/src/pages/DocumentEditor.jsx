import { useParams } from 'react-router-dom';
import { useDocument, useRenameDocument } from '@/hooks/useDocument';
import { DocHeader } from '@/components/layout/DocHeader';
import { Loader } from '@/components/shared/Loader';
import { Editor } from '@/components/editor/Editor';

export default function DocumentEditor() {
  const { id } = useParams();
  const { data: document, isLoading, isError, error } = useDocument(id);
  const renameDocument = useRenameDocument(id);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="mx-auto max-w-xl p-8 text-sm text-red-500">
        Failed to load document: {error.response?.data?.error || error.message}
      </div>
    );
  }

  if (!document) return null;

  return (
    <div>
      <DocHeader
        title={document.title}
        onRename={(title) => renameDocument.mutate(title)}
        isSaving={renameDocument.isPending}
      />
      <Editor key={document._id} document={document} />
    </div>
  );
}
