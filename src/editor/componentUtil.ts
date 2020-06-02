import NotFound from './NotFound';
import { ComponentOptions, ComponentEditableData, ComponentData } from '@/types/editor';
import { randomId } from '@/utils/randomId';

interface Shortcut {
  name: string;
  type: string;
}

// 左侧组件列表的显示
export const shortcuts: { title: string; key: string; children: Shortcut[] }[] = [];

const components: { [key: string]: ComponentOptions } = {};

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

export function isValidComponent(type: string) {
  return Object.prototype.hasOwnProperty.call(components, type);
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

export const createComponentData = (
  obj: { type: string } & Partial<ComponentEditableData>
): ComponentData => {
  const { defaultSize } = getComponent(obj.type);
  const id = randomId();
  const defaultConfig = { data: {}, left: 10, top: 10, width: 200, height: 100, ...defaultSize };

  return { ...defaultConfig, ...obj, id };
};

export const cloneComponentData = (
  base: ComponentData,
  obj: Partial<ComponentEditableData>
): ComponentData => {
  const newData: ComponentData = JSON.parse(JSON.stringify(base));
  Object.assign(newData, obj);
  newData.id = randomId();

  return newData;
};

// 组件剪切板
export const clipboard: { data: ComponentData[] } = { data: [] };

export const pasteComponentData = ({ x, y }: { x: number; y: number }) => {
  if (clipboard.data.length === 0) return [];
  const minX = Math.min(...clipboard.data.map(v => v.left));
  const minY = Math.min(...clipboard.data.map(v => v.top));
  const diffX = x - minX;
  const diffY = y - minY;
  return clipboard.data.map(v => {
    return cloneComponentData(v, { left: v.left + diffX, top: v.top + diffY });
  });
};