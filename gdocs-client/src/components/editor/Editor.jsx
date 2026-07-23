import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { collaborativeExtensions } from '@/lib/tiptap';
import { CollaborativeRoom, useLiveblocksExtension } from '@/lib/collaboration';
import { useUpdateDocument } from '@/hooks/useDocument';
import { Toolbar } from './Toolbar';
import { ImageUpload } from './ImageUpload';
import { MarginControls } from './MarginControls';
import { PresenceAvatars } from './PresenceAvatars';
import { CommentThread } from './CommentThread';
import { ExportMenu } from './ExportMenu';
import { CommentMark } from './extensions/CommentMark';
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
  const commentActivatedRef = useRef(() => {});
  const updateDocument = useUpdateDocument(document._id);
  const [isSaving, setIsSaving] = useState(false);
  const [margins, setMargins] = useState(document.margins || DEFAULT_MARGINS);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [pendingAnchor, setPendingAnchor] = useState(null);
  const [activeCommentId, setActiveCommentId] = useState(null);

  const liveblocksExtension = useLiveblocksExtension({
    initialContent: document.contentJSON || undefined,
  });

  const editor = useEditor({
    extensions: [
      liveblocksExtension,
      ...collaborativeExtensions,
      CommentMark.configure({
        onCommentActivated: (id) => commentActivatedRef.current(id),
      }),
    ],
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

  commentActivatedRef.current = (anchorId) => {
    setActiveCommentId(anchorId);
    setCommentsOpen(true);
    requestAnimationFrame(() => {
      window.document
        .getElementById(`comment-${anchorId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

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

  const handleAddComment = () => {
    if (!editor || editor.state.selection.empty) return;
    const { from, to } = editor.state.selection;
    const anchorId = crypto.randomUUID();
    setPendingAnchor({ from, to, anchorId });
    setCommentsOpen(true);
  };

  const handlePendingSubmitted = () => {
    if (pendingAnchor) {
      editor
        .chain()
        .setTextSelection({ from: pendingAnchor.from, to: pendingAnchor.to })
        .setComment(pendingAnchor.anchorId)
        .run();
    }
    setPendingAnchor(null);
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <Toolbar
          editor={editor}
          onInsertImage={() => imageUploadRef.current?.open()}
          onAddComment={handleAddComment}
          onToggleComments={() => setCommentsOpen((o) => !o)}
          commentsOpen={commentsOpen}
        />
        <ImageUpload ref={imageUploadRef} editor={editor} />

        <div className="flex items-center justify-between px-6 py-2">
          <PresenceAvatars />
          <div className="flex items-center gap-1">
            <ExportMenu documentId={document._id} title={document.title} />
            <MarginControls margins={margins} onChange={handleMarginsChange} />
          </div>
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

      {commentsOpen && (
        <CommentThread
          documentId={document._id}
          pendingAnchor={pendingAnchor}
          onCancelPending={() => setPendingAnchor(null)}
          onPendingSubmitted={handlePendingSubmitted}
          activeCommentId={activeCommentId}
        />
      )}
    </div>
  );
}
