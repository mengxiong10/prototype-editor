import { registerComponent } from '@/editor/componentUtil';
import { buttonOptions } from './Button';
import { inputOptions } from './Input';
import { richEditorOptions } from './RichEditor';
import { rectOptions } from './Rect';
import { textareaOptions } from './TextArea';
import { checkboxOptions } from './Checkbox';
import { radioOptions } from './Radio';

const groupBase = '基础组件';

registerComponent('rect', rectOptions);

registerComponent('button', buttonOptions, { group: groupBase, name: '按钮' });
registerComponent('input', inputOptions, { group: groupBase, name: '单行输入' });
registerComponent('textarea', textareaOptions, { group: groupBase, name: '多行输入' });
registerComponent('rich', richEditorOptions, { group: groupBase, name: '富文本' });
registerComponent('checkbox', checkboxOptions, { group: groupBase, name: '多选框' });
registerComponent('radio', radioOptions, { group: groupBase, name: '单选框' });
