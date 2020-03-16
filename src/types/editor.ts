import { DetailPanelGroup } from '@/editor/DetailPanel';

export interface ComponentPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type ComponentId = string;

export interface ComponentData<T = any> {
  id: ComponentId;
  type: string;
  position: ComponentPosition;
  data: T;
}

export interface ComponentOptions<T = any> {
  component: React.ElementType;
  detailPanel: React.ElementType | Array<DetailPanelGroup<Extract<keyof T, string>>>;
  defaultSize?: { width: number; height: number };
  defaultData: T;
}
