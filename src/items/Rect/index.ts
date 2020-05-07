import { ComponentOptions } from '@/types/editor';
import Rect, { RectProps } from './Rect';

export const rectOptions: ComponentOptions<RectProps> = {
  component: Rect,
  wrapperStyle: { pointerEvents: 'none' },
  defaultData: {
    stroke: 'rgb(221, 208, 0)',
    strokeWidth: 2,
  },
  detailPanel: [
    {
      title: '外观',
      list: [
        { title: '线框颜色', prop: 'stroke', type: 'color' },
        { title: '线框宽度', prop: 'strokeWidth', type: 'number' },
      ],
    },
  ],
};
