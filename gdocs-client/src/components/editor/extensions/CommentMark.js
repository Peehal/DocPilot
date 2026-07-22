import { Mark, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

// Wraps selected text in a <span data-comment-id="..."> so a sidebar thread
// can be linked back to the exact text it was left on.
export const CommentMark = Mark.create({
  name: 'comment',

  addOptions() {
    return {
      HTMLAttributes: {},
      onCommentActivated: () => {},
    };
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-comment-id'),
        renderHTML: (attributes) => {
          if (!attributes.commentId) return {};
          return { 'data-comment-id': attributes.commentId };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-comment-id]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: 'comment-highlight' }),
      0,
    ];
  },

  addCommands() {
    return {
      setComment:
        (commentId) =>
        ({ commands }) =>
          commands.setMark(this.name, { commentId }),
      unsetComment:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },

  addProseMirrorPlugins() {
    const { onCommentActivated } = this.options;

    return [
      new Plugin({
        key: new PluginKey('commentClickHandler'),
        props: {
          handleClick(_view, _pos, event) {
            const commentId = event.target?.closest?.('[data-comment-id]')?.getAttribute('data-comment-id');
            if (commentId) {
              onCommentActivated(commentId);
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});
