import React, { useCallback } from 'react';
import DragResizable from '../components/DragResizable';
import { getComponent } from './components';
import { ComponentData, ComponentPosition } from '@/types/editor';
import { useEditorDispatch } from './EditorContext';

export interface ComponentWrapperProps extends ComponentData {
  active: boolean;
  onSelect: (id: string) => void;
}

function ComponentWrapper(props: ComponentWrapperProps) {
  const component = getComponent(props.type);
  const dispatch = useEditorDispatch();
  const updatePosition = useCallback(
    (position: ComponentPosition) => {
      dispatch({ type: 'update', payload: { id: props.id, position } });
    },
    [dispatch, props.id]
  );

  if (!component) {
    console.warn(`${props.type} 未注册`);
    return null;
  }
  return (
    <DragResizable {...props.position} active={props.active} onStop={updatePosition}>
      <div className="pe-component-wrapper" onMouseDownCapture={() => props.onSelect(props.id)}>
        {React.createElement(component.component, {
          ...component.defaultData,
          ...props.data,
        })}
      </div>
    </DragResizable>
  );
}

export default React.memo(ComponentWrapper);
