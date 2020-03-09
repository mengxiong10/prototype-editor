export interface ComponentPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ComponentData<T = any> {
  id: string;
  type: string;
  position: ComponentPosition;
  data: T;
}

export interface ComponentOptions<T = any> {
  component: React.ElementType;
  detailPanel: React.ElementType;
  defaultSize?: { width: number; height: number };
  defaultData: T;
}
