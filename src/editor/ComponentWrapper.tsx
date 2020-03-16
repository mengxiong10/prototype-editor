import React, { useCallback } from 'react';
import DragResizable from '../components/DragResizable';
import { getComponent } from './registerComponents';
import { ComponentData, ComponentPosition } from '@/types/editor';
import { useEditor } from './Context';
import { actions } from './reducer';

export interface ComponentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  data: ComponentData;
}

function ComponentWrapper({ active, data, ...rest }: ComponentWrapperProps) {
  const component = getComponent(data.type);
  const dispatch = useEditor();
  const updatePosition = useCallback(
    (position: ComponentPosition) => {
      dispatch(actions.update({ id: data.id, position }));
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
