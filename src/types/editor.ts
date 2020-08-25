import type { DetailPanelGroup } from 'src/editor/PanelDetailDefault';
import type { PanelChangeHandler } from 'src/editor/PanelDetailHelper';

export type ComponentId = string;

// TODO: 如果有的组件没有size的话, 需要考虑圈选的时候 计算宽度的问题 (可以size 自动上报机制)
export interface ComponentData<T = any> {
  id: ComponentId;
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  data: T;
  association?: ComponentId;
}

// 可编辑属性
export type ComponentEditableData<T = any> = Omit<ComponentData<T>, 'id' | 'type'>;

export type DetailPanelType<T = any> =
  | React.ComponentType<{ data: T; onChange: PanelChangeHandler }>
  | DetailPanelGroup<T>[];

export interface ComponentOptions<T = any> {
  component: React.ComponentType<T>;
  wrapperStyle?: React.CSSProperties;
  defaultData: T;
  defaultSize?: { width: number; height: number };
  detailPanel?: DetailPanelType<T>;
}
