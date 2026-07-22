import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { collaborativeExtensions } from '@/lib/tiptap';
import { CollaborativeRoom, useLiveblocksExtension } from '@/lib/collaboration';
import { useUpdateDocument } from '@/hooks/useDocument';
import { Toolbar } from './Toolbar';
import { ImageUpload } from './ImageUpload';
import { MarginControls } from './MarginControls';
import { PresenceAvatars } from './PresenceAvatars';
import { Loader } from '@/components/shared/Loader';
import './editor.css';

const DEFAULT_MARGINS = { top: 96, bottom: 96, left: 96, right: 96 };

export function Editor({ document }) {
  return (
    <CollaborativeRoom roomId={document.liveblocksRoomId} fallback={<Loader />}>
      <EditorCanvas document={document} />
    </CollaborativeRoom>
  );
}

function EditorCanvas({ document }) {
  const imageUploadRef = useRef(null);
  const saveTimer = useRef(null);
  const pendingContentRef = useRef(null);
  const updateDocument = useUpdateDocument(document._id);
  const [isSaving, setIsSaving] = useState(false);
  const [margins, setMargins] = useState(document.margins || DEFAULT_MARGINS);

  const liveblocksExtension = useLiveblocksExtension({
    initialContent: document.contentJSON || undefined,
  });

  const editor = useEditor({
    extensions: [liveblocksExtension, ...collaborativeExtensions],
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      pendingContentRef.current = json;
      setIsSaving(true);
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateDocument.mutate(
          { contentJSON: json },
          {
            onSettled: () => setIsSaving(false),
            onSuccess: () => {
              pendingContentRef.current = null;
            },
          }
        );
      }, 800);
    },
  });

  useEffect(
    () => () => {
      clearTimeout(saveTimer.current);
      // Flush any edit that hadn't hit the debounce yet — otherwise navigating
      // away right after typing silently discards the last change from the
      // Mongo snapshot (Yjs/Liveblocks already has it live, but the snapshot
      // used for export/search/previews would still lag behind).
      if (pendingContentRef.current !== null) {
        updateDocument.mutate({ contentJSON: pendingContentRef.current });
      }
    },
    []
  );

  const handleMarginsChange = (nextMargins) => {
    setMargins(nextMargins);
    updateDocument.mutate({ margins: nextMargins });
  };

  return (
    <div>
      <Toolbar editor={editor} onInsertImage={() => imageUploadRef.current?.open()} />
      <ImageUpload ref={imageUploadRef} editor={editor} />

      <div className="flex items-center justify-between px-6 py-2">
        <PresenceAvatars />
        <MarginControls margins={margins} onChange={handleMarginsChange} />
      </div>

      <div className="mx-auto max-w-4xl pb-16">
        <div
          className="min-h-[70vh] rounded-lg border bg-background shadow-sm"
          style={{
            paddingTop: margins.top,
            paddingBottom: margins.bottom,
            paddingLeft: margins.left,
            paddingRight: margins.right,
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {isSaving && (
        <div className="fixed bottom-4 right-4 rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground shadow">
          Saving...
        </div>
      )}
    </div>
  );
}
