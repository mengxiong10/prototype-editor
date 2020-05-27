import React from 'react';
import classnames from 'classnames';
import Draggable, { DraggableHandler } from '@/components/Draggable';
import { ComponentData } from '@/types/editor';
import { useEditor } from './Context';
import { actions } from './reducer';
import { getComponent } from './registerComponents';
import { useComponent } from './useComponent';

export interface ComponentWrapperProps {
  active: boolean;
  item: ComponentData;
}

function ComponentWrapper({ active, item }: ComponentWrapperProps) {
  const { rect, id, type, data: componentData } = item;

  const dispatch = useEditor();

  // 选中组件
  const handleSelect = (evt: React.MouseEvent) => {
    dispatch(evt.shiftKey ? actions.selectMultiple(id) : actions.selectSingle(id));
  };

  const handleMove: DraggableHandler = coreData => {
    dispatch(
      actions.update({
        rect: prev => {
          return {
            left: prev.left + coreData.deltaX,
            top: prev.top + coreData.deltaY,
          };
        },
      })
    );
  };

  const component = useComponent({ type, componentData });

  const style: React.CSSProperties = {
    ...getComponent(type).wrapperStyle,
    ...rect,
    position: 'absolute',
  };

  const classNames = classnames('pe-component-wrapper', {
    active,
  });

  return (
    <Draggable onMouseDown={handleSelect} onMove={handleMove}>
      <div className={classNames} style={style} data-id={item.id}>
        {component}
      </div>
    </Draggable>
  );
}

export default React.memo(ComponentWrapper);
