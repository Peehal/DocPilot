import { useRef, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Check, MessageSquareOff, Reply as ReplyIcon, Trash2, X } from 'lucide-react';
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
  useUserSearch,
} from '@/hooks/useComments';
import { Button } from '@/components/ui/button';
import { MentionList } from './MentionList';

function useMentionInput() {
  const [text, setText] = useState('');
  const [mentions, setMentions] = useState([]);
  const [query, setQuery] = useState('');
  const textareaRef = useRef(null);
  const { data: matches } = useUserSearch(query);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    const cursor = e.target.selectionStart;
    const uptoCursor = value.slice(0, cursor);
    const match = uptoCursor.match(/@([^\s@]*)$/);
    setQuery(match ? match[1] : '');
  };

  const selectMention = (user) => {
    const cursor = textareaRef.current?.selectionStart ?? text.length;
    const uptoCursor = text.slice(0, cursor);
    const replaced = uptoCursor.replace(/@([^\s@]*)$/, `@${user.name} `);
    setText(replaced + text.slice(cursor));
    setMentions((prev) => (prev.some((m) => m.clerkId === user.clerkId) ? prev : [...prev, user]));
    setQuery('');
    textareaRef.current?.focus();
  };

  const reset = () => {
    setText('');
    setMentions([]);
    setQuery('');
  };

  return { text, mentions, matches, textareaRef, handleChange, selectMention, reset };
}

function Composer({ placeholder, onSubmit, onCancel, autoFocus }) {
  const { text, mentions, matches, textareaRef, handleChange, selectMention, reset } =
    useMentionInput();

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({ body: text.trim(), mentions: mentions.map((m) => m.clerkId) });
    reset();
  };

  return (
    <div className="relative space-y-2">
      <textarea
        ref={textareaRef}
        autoFocus={autoFocus}
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none rounded-md border bg-background p-2 text-sm outline-none focus:ring-1 focus:ring-ring"
      />
      {matches?.length > 0 && <MentionList users={matches} onSelect={selectMention} />}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button size="sm" onClick={handleSubmit}>
          Comment
        </Button>
      </div>
    </div>
  );
}

function CommentItem({ comment, isOwn, onReply, onResolveToggle, onDelete, isActive }) {
  return (
    <div
      id={comment.anchorId ? `comment-${comment.anchorId}` : undefined}
      className={`rounded-md border p-3 text-sm ${isActive ? 'border-ring bg-muted/50' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
            {(comment.author?.name || '?').charAt(0).toUpperCase()}
          </span>
          <span className="font-medium">{comment.author?.name || 'Unknown user'}</span>
        </div>
        {!comment.parentId && (
          <button
            type="button"
            title={comment.resolved ? 'Unresolve' : 'Resolve'}
            onClick={onResolveToggle}
            className="text-muted-foreground hover:text-foreground"
          >
            {comment.resolved ? <MessageSquareOff size={14} /> : <Check size={14} />}
          </button>
        )}
      </div>

      <p className="mt-1 whitespace-pre-wrap text-foreground/90">{comment.body}</p>

      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        <span>{new Date(comment.createdAt).toLocaleString()}</span>
        {!comment.parentId && (
          <button type="button" onClick={onReply} className="flex items-center gap-1 hover:text-foreground">
            <ReplyIcon size={12} /> Reply
          </button>
        )}
        {isOwn && (
          <button type="button" onClick={onDelete} className="flex items-center gap-1 hover:text-destructive">
            <Trash2 size={12} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

export function CommentThread({ documentId, pendingAnchor, onCancelPending, onPendingSubmitted, activeCommentId }) {
  const { user } = useUser();
  const { data: comments = [] } = useComments(documentId);
  const createComment = useCreateComment(documentId);
  const updateComment = useUpdateComment(documentId);
  const deleteComment = useDeleteComment(documentId);
  const [replyingTo, setReplyingTo] = useState(null);

  const topLevel = comments.filter((c) => !c.parentId);
  const repliesFor = (id) => comments.filter((c) => c.parentId === id);

  return (
    <div className="flex w-80 shrink-0 flex-col gap-3 border-l p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Comments</h2>
        {pendingAnchor && (
          <button type="button" onClick={onCancelPending} className="text-muted-foreground hover:text-foreground">
            <X size={14} />
          </button>
        )}
      </div>

      {pendingAnchor && (
        <Composer
          autoFocus
          placeholder="Add a comment..."
          onCancel={onCancelPending}
          onSubmit={(payload) => {
            createComment.mutate(
              { ...payload, anchorId: pendingAnchor.anchorId },
              { onSuccess: onPendingSubmitted }
            );
          }}
        />
      )}

      {topLevel.length === 0 && !pendingAnchor && (
        <p className="text-sm text-muted-foreground">
          Select some text and click the comment icon in the toolbar to leave a comment.
        </p>
      )}

      <div className="flex flex-col gap-3 overflow-y-auto">
        {topLevel.map((comment) => (
          <div key={comment._id} className="space-y-2">
            <CommentItem
              comment={comment}
              isOwn={comment.authorId === user?.id}
              isActive={activeCommentId === comment.anchorId}
              onReply={() => setReplyingTo(comment._id)}
              onResolveToggle={() =>
                updateComment.mutate({ commentId: comment._id, resolved: !comment.resolved })
              }
              onDelete={() => deleteComment.mutate(comment._id)}
            />

            {repliesFor(comment._id).map((reply) => (
              <div key={reply._id} className="ml-6">
                <CommentItem
                  comment={reply}
                  isOwn={reply.authorId === user?.id}
                  onDelete={() => deleteComment.mutate(reply._id)}
                />
              </div>
            ))}

            {replyingTo === comment._id && (
              <div className="ml-6">
                <Composer
                  autoFocus
                  placeholder="Reply..."
                  onCancel={() => setReplyingTo(null)}
                  onSubmit={(payload) => {
                    createComment.mutate(
                      { ...payload, parentId: comment._id },
                      { onSuccess: () => setReplyingTo(null) }
                    );
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
