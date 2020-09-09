import { registerComponent } from 'src/editor/componentUtil';
import type { ItemPanelTreeItem } from 'src/editor/ItemPanel';
import { buttonOptions } from './Button';
import { inputOptions } from './Input';
import { richEditorOptions } from './RichEditor';
import { rectOptions } from './Rect';
import { textareaOptions } from './TextArea';
import { checkboxOptions } from './Checkbox';
import { radioOptions } from './Radio';
import { groupOptions } from './Group';

export const itemPanelTree: ItemPanelTreeItem[] = [
  {
    key: 'base',
    name: '基础组件',
    children: [
      { type: 'button', options: buttonOptions, name: '按钮' },
      { type: 'input', options: inputOptions, name: '单行输入' },
      { type: 'textarea', options: textareaOptions, name: '多行输入' },
      { type: 'rich', options: richEditorOptions, name: '富文本' },
      { type: 'checkbox', options: checkboxOptions, name: '多选框' },
      { type: 'radio', options: radioOptions, name: '单选框' },
    ],
  },
  {
    key: 'test',
    name: '测试',
    children: [{ type: 'group', options: groupOptions, name: '组合' }],
  },
];

itemPanelTree.forEach((item) => {
  item.children.forEach((v) => {
    registerComponent(v.type, v.options);
  });
});

registerComponent('rect', rectOptions);
