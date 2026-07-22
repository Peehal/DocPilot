import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  ListChecks,
  Link as LinkIcon,
  Table as TableIcon,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  MessageSquarePlus,
  MessagesSquare,
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarDropdown } from './ToolbarDropdown';

const TEXT_COLORS = [
  { label: 'Default', value: null },
  { label: 'Red', value: '#dc2626' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Purple', value: '#9333ea' },
];

export function Toolbar({ editor, onInsertImage, onAddComment, onToggleComments, commentsOpen }) {
  if (!editor) return null;

  const headingItems = [1, 2, 3].map((level) => ({
    label: `Heading ${level}`,
    isActive: editor.isActive('heading', { level }),
    onClick: () => editor.chain().focus().toggleHeading({ level }).run(),
  }));
  headingItems.unshift({
    label: 'Paragraph',
    isActive: editor.isActive('paragraph'),
    onClick: () => editor.chain().focus().setParagraph().run(),
  });

  const colorItems = TEXT_COLORS.map((c) => ({
    label: c.label,
    isActive: c.value ? editor.isActive('textStyle', { color: c.value }) : false,
    onClick: () =>
      c.value
        ? editor.chain().focus().setColor(c.value).run()
        : editor.chain().focus().unsetColor().run(),
  }));

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b px-3 py-1.5">
      <ToolbarDropdown label="Text style" items={headingItems} />

      <div className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        title="Bold"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </ToolbarButton>

      <ToolbarDropdown label="Color" items={colorItems} />

      <div className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        title="Align left"
        isActive={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Align center"
        isActive={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Align right"
        isActive={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight size={16} />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        title="Bullet list"
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Checklist"
        isActive={editor.isActive('taskList')}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <ListChecks size={16} />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton title="Link" isActive={editor.isActive('link')} onClick={setLink}>
        <LinkIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Insert table"
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <TableIcon size={16} />
      </ToolbarButton>
      <ToolbarButton title="Insert image" onClick={onInsertImage}>
        <ImageIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Comment on selection"
        disabled={editor.state.selection.empty}
        onClick={onAddComment}
      >
        <MessageSquarePlus size={16} />
      </ToolbarButton>
      <ToolbarButton title="Toggle comments" isActive={commentsOpen} onClick={onToggleComments}>
        <MessagesSquare size={16} />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        title="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={16} />
      </ToolbarButton>
    </div>
  );
}
