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
    componentMap.get(type) ||
    ({
      component: NotFound,
      defaultData: { type },
      defaultSize: { width: 200, height: 40 },
    } as ComponentOptions)
  );
}

/**
 * 时光荏苒
 * 记忆中总有这样一些人
 * 初见便定格了一生
 * 低眉浅笑间润色了时光
 * 惊艳了岁月
 */
export const createComponentData = (
  obj: Partial<ComponentData> & Pick<ComponentData, 'type'>
): ComponentData => {
  const { defaultSize } = getComponent(obj.type);
  const id = randomId();

  return { id, data: {}, left: 10, top: 10, width: 200, height: 100, ...defaultSize, ...obj };
};

/**
 * 回忆如此玄妙
 * 她总会抹去坏的
 * 放大好的
 * 正因如此
 * 我们才得以承担过去的重负
 * -- 马尔克斯
 */
export const cloneComponentData = (
  base: ComponentData,
  obj: Partial<ComponentEditableData>
): ComponentData => {
  const newData: ComponentData = JSON.parse(JSON.stringify(base));
  Object.assign(newData, obj);
  newData.id = randomId();

  return newData;
};
