import { DetailPanelGroup } from '@/editor/PanelDetail';

export interface ComponentRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type ComponentId = string;

// TODO: 如果有的组件没有size的话, 需要考虑圈选的时候 计算宽度的问题
export interface ComponentData<T = any> {
  id: ComponentId;
  type: string;
  rect: ComponentRect;
  data: T;
}

export interface ComponentOptions<T = any> {
  component: React.ElementType;
  wrapperStyle?: React.CSSProperties;
  defaultData: T;
  defaultSize?: { width: number; height: number };
  detailPanel?: React.ElementType | DetailPanelGroup<Extract<keyof T, string>>[];
}
