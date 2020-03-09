import React from 'react';
import DragResizable from '../components/DragResizable';
import { getComponent } from './components';
import { ComponentData } from '@/types/editor';

export interface ComponentWrapperProps extends ComponentData {}

function ComponentWrapper(props: ComponentWrapperProps) {
  const component = getComponent(props.type);
  if (!component) {
    console.warn(`${props.type} 未注册`);
    return null;
  }
  return (
    <DragResizable {...props.position}>
      <div className="pe-component-wrapper">
        {React.createElement(component.component, {
          ...component.defaultData,
          ...props.data,
        })}
      </div>
    </DragResizable>
  );
}

export default React.memo(ComponentWrapper);
