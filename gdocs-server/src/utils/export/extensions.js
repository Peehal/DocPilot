import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Mark, mergeAttributes } from '@tiptap/core';

// Schema-only mirror of the client's CommentMark (components/editor/extensions/CommentMark.js)
// — generateHTML() just needs the node/mark schema to recognize `comment` marks
// stored in contentJSON; it doesn't need the click-to-open-sidebar behavior.
const CommentMark = Mark.create({
  name: 'comment',
  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-comment-id'),
        renderHTML: (attributes) =>
          attributes.commentId ? { 'data-comment-id': attributes.commentId } : {},
      },
    };
  },
  parseHTML() {
    return [{ tag: 'span[data-comment-id]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { class: 'comment-highlight' }), 0];
  },
});

export const exportExtensions = [
  StarterKit.configure({ link: false, undoRedo: false }),
  Underline,
  TextStyle,
  Color,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Link.configure({ openOnClick: false, autolink: true }),
  Image,
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  TaskList,
  TaskItem.configure({ nested: true }),
  CommentMark,
];
