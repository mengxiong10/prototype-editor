import NotFound from './NotFound';
import { ComponentOptions } from '@/types/editor';
import { buttonOptions } from '@/items/Button';
import { inputOptions } from '@/items/Input';
import { richEditorOptions } from '@/items/RichEditor';
import { rectOptions } from '@/items/Rect';
import { textareaOptions } from '@/items/TextArea';

interface Shortcut {
  name: string;
  type: string;
}

/**
 * 左侧组件的显示
 */
export const shortcuts: { title: string; key: string; children: Shortcut[] }[] = [
  { title: '基础组件', key: 'base', children: [] },
];

const components: {
  [key: string]: ComponentOptions;
} = {};

function registerComponent(
  type: string,
  options: ComponentOptions,
  shortcut?: { name: string; group: string }
) {
  components[type] = options;
  if (shortcut) {
    const { name, group } = shortcut;
    const item = shortcuts.find(v => v.key === group);
    if (item) {
      item.children.push({ name, type });
    }
  }
}

export function getComponent(type: string) {
  return (
    components[type] || {
      component: NotFound,
      defaultData: { type },
      defaultSize: { width: 200, height: 40 },
    }
  );
}

registerComponent('button', buttonOptions, { group: 'base', name: '按钮' });
registerComponent('input', inputOptions, { group: 'base', name: '单行输入' });
registerComponent('textarea', textareaOptions, { group: 'base', name: '多行输入' });
registerComponent('rich', richEditorOptions, { group: 'base', name: '富文本' });
registerComponent('rect', rectOptions);
