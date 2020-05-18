import { EditorState } from 'draft-js';
import RichEditor, { RichEditorProps } from './RichEditor';
import { ComponentOptions } from '../../types/editor';

export const richEditorOptions: ComponentOptions<RichEditorProps> = {
  component: RichEditor,
  defaultSize: {
    width: 250,
    height: 180,
  },
  defaultData: {
    value: EditorState.createEmpty(),
    backgroundColor: '#fffbba',
  },
};
