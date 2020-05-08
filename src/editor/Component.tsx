import React from 'react';
import { getComponent } from './registerComponents';

export interface ComponentProps {
  type: string;
  data: any;
}

// 废弃
function Component({ type, data }: ComponentProps) {
  const componentOption = getComponent(type);

  return React.createElement(componentOption.component, {
    ...componentOption.defaultData,
    ...data,
  });
}

export default React.memo(Component);
