import Button, { ButtonProps } from './Button';
import { ComponentOptions } from '../../types/editor';

export const buttonOptions: ComponentOptions<ButtonProps> = {
  component: Button,
  defaultSize: {
    width: 100,
    height: 50,
  },
  defaultData: {
    circle: false,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    color: '#333',
    textAlign: 'center',
    textContent: '按钮',
    fontWeight: 'normal',
    disabled: false,
  },
  detailPanel: [
    {
      title: '外观',
      list: [
        { title: '是否圆形', prop: 'circle', type: 'switch' },
        { title: '是否禁用', prop: 'disabled', type: 'switch' },
        { title: '背景颜色', prop: 'backgroundColor', type: 'color' },
        { title: '边框颜色', prop: 'borderColor', type: 'color' },
        { title: '文字颜色', prop: 'color', type: 'color' },
        { title: '边框宽度', prop: 'borderWidth', type: 'number' },
      ],
    },
    {
      title: '字段设置',
      list: [{ title: '文字内容', prop: 'textContent', type: 'input' }],
    },
  ],
};
