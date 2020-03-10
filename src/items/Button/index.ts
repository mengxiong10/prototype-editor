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
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    color: '#333',
    textAlign: 'center',
    textContent: '按钮',
    fontWeight: 'normal',
    disabled: false,
  },
};
