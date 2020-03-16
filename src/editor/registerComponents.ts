import { ComponentOptions } from '@/types/editor';
import { buttonOptions } from '@/items/Button';
import { inputOptions } from '@/items/Input';

const components: {
  [key: string]: ComponentOptions;
} = {};

function registerComponent(name: string, options: ComponentOptions) {
  components[name] = options;
}

export function getComponent(name: string) {
  return components[name];
}

registerComponent('button', buttonOptions);
registerComponent('input', inputOptions);
