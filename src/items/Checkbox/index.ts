import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd/lib/checkbox';
import type { ComponentOptions } from 'src/editor/type';

export const checkboxOptions: ComponentOptions<CheckboxProps> = {
  component: Checkbox,
  defaultSize: {
    width: 100,
    height: 22,
  },
  defaultData: {
    checked: false,
    disabled: false,
    children: 'checkbox',
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
