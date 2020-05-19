import { Radio } from 'antd';
import { RadioProps } from 'antd/lib/radio';
import { ComponentOptions } from '@/types/editor';

export const radioOptions: ComponentOptions<RadioProps> = {
  component: Radio,
  defaultSize: {
    width: 100,
    height: 22,
  },
  defaultData: {
    checked: false,
    disabled: false,
    children: '单选',
  },
  detailPanel: [
    {
      title: '外观',
      list: [
        { title: '是否选中', type: 'switch', prop: 'checked' },
        { title: '是否禁用', type: 'switch', prop: 'disabled' },
      ],
    },
    {
      title: '字段设置',
      list: [{ title: '文字内容', type: 'input', prop: 'children' }],
    },
  ],
};
