import { registerComponent } from '../editor/component';

import Button, { defaultData, ButtonProps } from './Button';
import ButtonDetailPanel from './Button/DetailPanel';

registerComponent('button', {
  component: Button,
  detailPanel: ButtonDetailPanel,
  defaultSize: {
    width: 100,
    height: 50,
  },
  defaultData,
  // toolbarStatus(data) {
  //   return {
  //     bold: data.fontWeight === 'bold',
  //   };
  // },
  command: {
    bold(data: ButtonProps) {
      return { fontWeight: data.fontWeight === 'bold' ? 'normal' : 'bold' };
    },
  },
});
