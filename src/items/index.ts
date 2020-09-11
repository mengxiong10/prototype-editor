import type { ItemPanelGroup, ItemPanelItem } from 'src/editor/ItemPanel';
import { registerComponent } from 'src/editor/componentUtil';
import { buttonOptions } from './Button';
import { inputOptions } from './Input';
import { richEditorOptions } from './RichEditor';
import { rectOptions } from './Rect';
import { textareaOptions } from './TextArea';
import { checkboxOptions } from './Checkbox';
import { radioOptions } from './Radio';

import { formOptions } from './Form';
import { formGroupOptions } from './Form/FormGroup';
import { formInputOptions } from './Form/FormInput';
import { formSectionOptions } from './Form/FormSection';
import { formTabOptions } from './Form/FormTab';

export const itemPanelGroup: ItemPanelGroup[] = [
  {
    key: 'base',
    name: '基础组件',
    children: [
      { name: '按钮', type: 'button', options: buttonOptions },
      { name: '单行输入', type: 'input', options: inputOptions },
      { name: '多行输入', type: 'textarea', options: textareaOptions },
      { name: '富文本', type: 'rich', options: richEditorOptions },
      { name: '多选框', type: 'checkbox', options: checkboxOptions },
      { name: '单选框', type: 'radio', options: radioOptions },
    ],
  },
  {
    key: 'refactor',
    name: '重构页面',
    children: [
      {
        name: '表单',
        type: 'r-form',
        options: formOptions,
        children: [
          // . 分割,方便通过type, 判断dropzone是否允许添加
          { name: '分区', type: 'r-form.section', options: formSectionOptions },
          { name: '标签页', type: 'r-form.tab', options: formTabOptions },
          { name: '分组', type: 'r-form.group', options: formGroupOptions },
          { name: '文本', type: 'r-form.group.input', options: formInputOptions },
          { name: '按钮', type: 'r-form.group.button', options: buttonOptions },
          { name: '单行输入', type: 'r-form.group.oi', options: inputOptions },
        ],
      },
    ],
  },
];

function registerItemPanel(item: ItemPanelItem) {
  registerComponent(item.type, item.options);
  if (item.children) {
    item.children.forEach(registerItemPanel);
  }
}

itemPanelGroup.forEach((item) => item.children.forEach(registerItemPanel));

registerComponent('rect', rectOptions);
