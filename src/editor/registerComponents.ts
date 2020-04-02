import NotFound from './NotFound';
import { ComponentOptions } from '@/types/editor';
import { buttonOptions } from '@/items/Button';
import { inputOptions } from '@/items/Input';
import { commentOptions } from '@/items/Comment';
import { rectOptions } from '@/items/Rect';

const components: {
  [key: string]: ComponentOptions;
} = {};

function registerComponent(type: string, options: ComponentOptions) {
  components[type] = options;
}

export function getComponent(type: string) {
  return (
    components[type] || {
      component: NotFound,
      defaultData: { type },
      defaultSize: { width: 200, height: 40 },
    }
  );
}

registerComponent('button', buttonOptions);
registerComponent('input', inputOptions);
registerComponent('comment', commentOptions);
registerComponent('rect', rectOptions);
