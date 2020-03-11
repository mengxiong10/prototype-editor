import React, { useCallback } from 'react';
import DragResizable from '../components/DragResizable';
import { getComponent } from './components';
import { ComponentData, ComponentPosition } from '@/types/editor';
import { useEditorDispatch } from './Context';

export interface ComponentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  data: ComponentData;
}

function ComponentWrapper({ active, data, ...rest }: ComponentWrapperProps) {
  const component = getComponent(data.type);
  const dispatch = useEditorDispatch();
  const updatePosition = useCallback(
    (position: ComponentPosition) => {
      dispatch({ type: 'update', payload: { id: data.id, position } });
    },
    [dispatch, data.id]
  );

  if (!component) {
    console.warn(`${data.type} 未注册`);
    return null;
  }
  return (
    <DragResizable {...data.position} active={active} onStop={updatePosition}>
      <div className="pe-component-wrapper" {...rest}>
        {React.createElement(component.component, {
          ...component.defaultData,
          ...data.data,
        })}
      </div>
    </DragResizable>
  );
}

export default React.memo(ComponentWrapper);
