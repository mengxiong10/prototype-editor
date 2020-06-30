import { EditorState } from 'draft-js';
import type { ComponentOptions } from 'src/types/editor';
import RichEditor, { RichEditorProps } from './RichEditor';

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
