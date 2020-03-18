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
  const dispatch = useEditor();
  const updatePosition = useCallback(
    (position: ComponentPosition) => {
      dispatch(actions.updatePosition({ id: data.id, position }));
    },
    [dispatch, data.id]
  );

  const component = getComponent(data.type);

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
