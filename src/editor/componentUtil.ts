import type { ComponentOptions, ComponentEditableData, ComponentData } from 'src/types/editor';
import { randomId } from 'src/utils/randomId';
import NotFound from './NotFound';

interface Shortcut {
  name: string;
  type: string;
}

// 左侧组件列表的显示
export const shortcuts: { title: string; children: Shortcut[] }[] = [];

function registerShortcut({ name, group, type }: { name: string; group: string; type: string }) {
  let item = shortcuts.find(v => v.title === group);
  if (!item) {
    item = { title: group, children: [] };
    shortcuts.push(item);
  }
  if (item.children.every(v => v.type !== type)) {
    item.children.push({ name, type });
  }
}

const components: { [key: string]: ComponentOptions } = {};

export function registerComponent(data: {
  type: string;
  options: ComponentOptions;
  name?: string;
  group?: string;
}) {
  const { type, options, name, group } = data;
  components[type] = options;
  if (group && name) {
    registerShortcut({ group, name, type });
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
  type: string,
  obj: Partial<ComponentEditableData>
): ComponentData => {
  const { defaultSize } = getComponent(type);
  const id = randomId();
  const defaultConfig = { data: {}, left: 10, top: 10, width: 200, height: 100, ...defaultSize };

  return { ...defaultConfig, ...obj, id, type };
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
