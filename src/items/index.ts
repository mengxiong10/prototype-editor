import { registerComponent as register } from 'src/editor/componentUtil';
import { buttonOptions } from './Button';
import { inputOptions } from './Input';
import { richEditorOptions } from './RichEditor';
import { rectOptions } from './Rect';
import { textareaOptions } from './TextArea';
import { checkboxOptions } from './Checkbox';
import { radioOptions } from './Radio';
import { groupOptions } from './Group';

const g1 = '基础组件';

register({ type: 'rect', options: rectOptions });

register({ type: 'button', options: buttonOptions, group: g1, name: '按钮' });
register({ type: 'input', options: inputOptions, group: g1, name: '单行输入' });
register({ type: 'textarea', options: textareaOptions, group: g1, name: '多行输入' });
register({ type: 'rich', options: richEditorOptions, group: g1, name: '富文本' });
register({ type: 'checkbox', options: checkboxOptions, group: g1, name: '多选框' });
register({ type: 'radio', options: radioOptions, group: g1, name: '单选框' });

register({ type: 'group', options: groupOptions, group: g1, name: '组合' });
