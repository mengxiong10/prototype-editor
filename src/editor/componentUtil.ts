import type {
  ComponentOptions,
  ComponentEditableData,
  ComponentData,
  CompositeData,
} from 'src/editor/type';
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
    componentMap.get(type) ||
    ({
      component: NotFound,
      defaultData: { type },
      defaultSize: { width: 200, height: 40 },
    } as ComponentOptions)
  );
}

export const createCompositeData = (type: string): CompositeData => {
  const { children } = getComponent(type);
  const id = randomId();
  const newData: CompositeData = { id, type, data: {} };
  if (Array.isArray(children)) {
    newData.children = children.map(createCompositeData);
  }

  return newData;
};

export const createComponentData = (type: string, obj: Partial<ComponentData>): ComponentData => {
  const { defaultSize, children } = getComponent(type);
  const id = randomId();
  const rect = { left: 10, top: 10, width: 200, height: 100, ...defaultSize };
  const newData: ComponentData = {
    id,
    data: {},
    ...rect,
    ...obj,
    type,
  };
  if (Array.isArray(children)) {
    newData.children = children.map(createCompositeData);
  }
  return newData;
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
