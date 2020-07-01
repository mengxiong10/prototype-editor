import { register } from 'src/editor/componentUtil';
import { buttonOptions } from './Button';
import { inputOptions } from './Input';
import { richEditorOptions } from './RichEditor';
import { rectOptions } from './Rect';
import { textareaOptions } from './TextArea';
import { checkboxOptions } from './Checkbox';
import { radioOptions } from './Radio';
import { groupOptions } from './Group';

register({ type: 'rect', options: rectOptions });

register([
  { type: 'button', options: buttonOptions, name: '按钮' },
  { type: 'input', options: inputOptions, name: '单行输入' },
  { type: 'textarea', options: textareaOptions, name: '多行输入' },
  { type: 'rich', options: richEditorOptions, name: '富文本' },
  { type: 'checkbox', options: checkboxOptions, name: '多选框' },
  { type: 'radio', options: radioOptions, name: '单选框' },
  { type: 'group', options: groupOptions, name: '组合' },
])('基础组件');
