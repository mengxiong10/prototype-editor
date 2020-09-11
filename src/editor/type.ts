import type { StateWithHistory } from 'redux-undo';
import type { DetailPanelGroup } from 'src/editor/DetailPanel/DetailPanelDefault';
import type { PanelChangeHandler } from 'src/editor/DetailPanel/Helpers';

export type ComponentId = string;

// TODO: 如果有的组件没有size的话, 需要考虑圈选的时候 计算宽度的问题 (可以size 自动上报机制)
export interface ComponentData<T = any, R = any> {
  id: ComponentId;
  type: string;
  data: T;
  left: number;
  top: number;
  width: number;
  height: number;
  association?: ComponentId;
  children?: R[];
}

export interface CompositeData<T = any, R = any> {
  id: ComponentId;
  type: string;
  data: T;
  children?: R[];
}

// export interface

// 可编辑属性
export type ComponentEditableData<T = any> = Omit<ComponentData<T>, 'id' | 'type'>;

export type DetailPanelType<T = any> =
  | React.ComponentType<{ data: T; onChange: PanelChangeHandler }>
  | DetailPanelGroup<T>[];

export interface ComponentOptions<T = any> {
  component: React.ComponentType<T>;
  wrapperStyle?: React.CSSProperties;
  defaultData: Partial<T>;
  children?: string[];
  defaultSize?: { width: number; height: number };
  detailPanel?: DetailPanelType<T>;
}

export interface Store {
  scale: number;
  data: StateWithHistory<ComponentData[]>;
  selected: ComponentId[];
  clipboard: ComponentData[];
}

export type SliceReducerHandler<S, P> = (state: S, payload: P, Store: Store) => S;
