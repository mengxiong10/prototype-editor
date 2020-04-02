import { DetailPanelGroup } from '@/editor/PanelDetail';

export interface ComponentPosition {
  left: number;
  top: number;
}

export interface ComponentSize {
  width: number;
  height: number;
}

export type ComponentId = string;

// TODO: 如果有的组件没有size的话, 需要考虑圈选的时候 计算宽度的问题
export interface ComponentData<T = any> {
  id: ComponentId;
  type: string;
  position: ComponentPosition;
  size: ComponentSize;
  data: T;
}

export interface ComponentOptions<T = any> {
  component: React.ElementType;
  defaultData: T;
  defaultSize?: { width: number; height: number };
  detailPanel?: React.ElementType | DetailPanelGroup<Extract<keyof T, string>>[];
}
