import Button, { ButtonProps } from './Button';
import ButtonDetailPanel from './DetailPanel';
import { ComponentOptions } from '../../types/editor';

export const buttonOptions: ComponentOptions<ButtonProps> = {
  component: Button,
  detailPanel: ButtonDetailPanel,
  defaultSize: {
    width: 100,
    height: 50,
  },
  defaultData: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
    borderWidth: 1,
    color: '#fff',
    textAlign: 'center',
    textContent: '按钮',
    fontWeight: 'normal',
    disabled: false,
  },
};
