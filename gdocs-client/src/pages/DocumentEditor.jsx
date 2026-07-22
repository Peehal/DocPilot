import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocument, useRenameDocument } from '@/hooks/useDocument';
import { DocHeader } from '@/components/layout/DocHeader';
import { Loader } from '@/components/shared/Loader';
import { Editor } from '@/components/editor/Editor';

export default function DocumentEditor() {
  const { id } = useParams();
  const { data: document, isLoading, isFetching, isError, error } = useDocument(id);
  const renameDocument = useRenameDocument(id);

  // A cached copy can render instantly (isLoading false) while the real
  // network fetch is still running in the background. Since the editor only
  // reads its content once at mount, we wait for that fetch to fully settle
  // before ever creating the editor, so it's never seeded with stale content.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [id]);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      setReady(true);
    }
  }, [isLoading, isFetching]);

  if (!ready) return <Loader />;

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
