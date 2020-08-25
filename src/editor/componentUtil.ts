import type { ComponentOptions, ComponentEditableData, ComponentData } from 'src/types/editor';
import { randomId } from 'src/utils/randomId';
import NotFound from './NotFound';

const componentMap = new Map<string, ComponentOptions>();

export function registerComponent(type: string, options: ComponentOptions) {
  componentMap.set(type, options);
}

export function isValidComponent(type: string) {
  return componentMap.has(type);
}

export function getComponent(type: string) {
  return (
    componentMap.get(type) || {
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
