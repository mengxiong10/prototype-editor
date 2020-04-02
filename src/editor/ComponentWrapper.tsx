import React, { useCallback } from 'react';
import DragResizable, { ResizableState } from '../components/DragResizable';
import { getComponent } from './registerComponents';
import { ComponentData } from '@/types/editor';
import { useEditor } from './Context';
import { actions } from './reducer';

export interface ComponentWrapperProps {
  active: boolean;
  data: ComponentData;
}

function ComponentWrapper({ active, data }: ComponentWrapperProps) {
  const dispatch = useEditor();
  const updatePosition = useCallback(
    ({ left, top, width, height }: ResizableState) => {
      dispatch(
        actions.update({
          id: data.id,
          position: { left, top },
          size: { width, height },
        })
      );
    },
    [dispatch, data.id]
  );

  const component = getComponent(data.type);

  return (
    <DragResizable {...data.position} {...data.size} active={active} onStop={updatePosition}>
      <div className="pe-component-wrapper" data-id={data.id}>
        {React.createElement(component.component, {
          ...component.defaultData,
          ...data.data,
        })}
      </div>
    </DragResizable>
  );
}

export default React.memo(ComponentWrapper);
