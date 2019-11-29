export interface RegisterComponentOptions<T = any> {
  component: React.ElementType;
  detailPanel: React.ElementType;
  defaultSize?: { width: number; height: number };
  defaultData: T;
  command?: { [key: string]: (data: any) => any };
}

const components: {
  [key: string]: RegisterComponentOptions;
} = {};

export function registerComponent(name: string, options: RegisterComponentOptions) {
  components[name] = options;
}

export function getComponent(name: string) {
  return components[name];
}
