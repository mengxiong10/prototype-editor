import { registerComponent } from '@/editor/registerComponents';
import { buttonOptions } from './Button';
import { inputOptions } from './Input';
import { richEditorOptions } from './RichEditor';
import { rectOptions } from './Rect';
import { textareaOptions } from './TextArea';

registerComponent('button', buttonOptions, { group: '基础组件', name: '按钮' });
registerComponent('input', inputOptions, { group: '基础组件', name: '单行输入' });
registerComponent('textarea', textareaOptions, { group: '基础组件', name: '多行输入' });
registerComponent('rich', richEditorOptions, { group: '基础组件', name: '富文本' });
registerComponent('rect', rectOptions);
