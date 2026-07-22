import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { editorExtensions } from '@/lib/tiptap';
import { useUpdateDocument } from '@/hooks/useDocument';
import { Toolbar } from './Toolbar';
import { ImageUpload } from './ImageUpload';
import { MarginControls } from './MarginControls';
import './editor.css';

const DEFAULT_MARGINS = { top: 96, bottom: 96, left: 96, right: 96 };

export function Editor({ document }) {
  const imageUploadRef = useRef(null);
  const saveTimer = useRef(null);
  const updateDocument = useUpdateDocument(document._id);
  const [isSaving, setIsSaving] = useState(false);
  const [margins, setMargins] = useState(document.margins || DEFAULT_MARGINS);

  const editor = useEditor({
    extensions: editorExtensions,
    content: document.contentJSON || '',
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => {
      setIsSaving(true);
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateDocument.mutate(
          { contentJSON: editor.getJSON() },
          { onSettled: () => setIsSaving(false) }
        );
      }, 800);
    },
  });

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const handleMarginsChange = (nextMargins) => {
    setMargins(nextMargins);
    updateDocument.mutate({ margins: nextMargins });
  };

  return (
    <div>
      <Toolbar editor={editor} onInsertImage={() => imageUploadRef.current?.open()} />
      <ImageUpload ref={imageUploadRef} editor={editor} />

      <div className="flex items-center justify-end px-6 py-2">
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
