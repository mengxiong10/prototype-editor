import { EditorState } from 'draft-js';
import Comment, { CommentProps } from './Comment';
import { ComponentOptions } from '../../types/editor';

export const commentOptions: ComponentOptions<CommentProps> = {
  component: Comment,
  defaultSize: {
    width: 250,
    height: 180,
  },
  defaultData: {
    value: EditorState.createEmpty(),
    backgroundColor: '#fffbba',
  },
};
