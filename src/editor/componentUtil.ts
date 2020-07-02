import type { ComponentOptions, ComponentEditableData, ComponentData } from 'src/types/editor';
import { randomId } from 'src/utils/randomId';
import { castArray } from 'lodash';
import NotFound from './NotFound';

interface Shortcut {
  type: string;
  name?: string;
}

interface RegisterComponentParams extends Shortcut {
  options: ComponentOptions;
}

const components: { [key: string]: ComponentOptions } = {};

function registerComponent(data: RegisterComponentParams | RegisterComponentParams[]) {
  castArray(data).forEach(({ type, options }) => {
    components[type] = options;
  });
}

// 左侧组件列表的显示
export const shortcuts: { group: string; children: Shortcut[] }[] = [];

function registerShortcut(data: Shortcut | Shortcut[], group: string) {
  let groupItem = shortcuts.find((v) => v.group === group);
  if (!groupItem) {
    groupItem = { group, children: [] };
    shortcuts.push(groupItem);
  }
  castArray(data).forEach(({ type, name }) => {
    if (groupItem!.children.every((v) => v.type !== type)) {
      groupItem!.children.push({ type, name });
    }
  });
}

export function register(data: RegisterComponentParams | RegisterComponentParams[]) {
  registerComponent(data);

  return (group: string) => registerShortcut(data, group);
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
  const minX = Math.min(...clipboard.data.map((v) => v.left));
  const minY = Math.min(...clipboard.data.map((v) => v.top));
  const diffX = x - minX;
  const diffY = y - minY;
  return clipboard.data.map((v) => {
    return cloneComponentData(v, { left: v.left + diffX, top: v.top + diffY });
  });
};
