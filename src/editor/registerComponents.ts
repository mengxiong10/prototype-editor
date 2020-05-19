import NotFound from './NotFound';
import { ComponentOptions } from '@/types/editor';

interface Shortcut {
  name: string;
  type: string;
}

/**
 * 左侧组件的显示
 */
export const shortcuts: { title: string; key: string; children: Shortcut[] }[] = [];

const components: {
  [key: string]: ComponentOptions;
} = {};

export function registerComponent(
  type: string,
  options: ComponentOptions,
  shortcut?: { name: string; group: string }
) {
  components[type] = options;
  if (shortcut) {
    const { name, group } = shortcut;
    let item = shortcuts.find(v => v.title === group);
    if (!item) {
      item = { title: group, key: String(shortcuts.length), children: [] };
      shortcuts.push(item);
    }
    if (item.children.every(v => v.type !== type)) {
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
