import React from 'react';
import classnames from 'classnames';
import Draggable, { DraggableHandler } from '@/components/Draggable';
import { ComponentData } from '@/types/editor';
import { useEditor } from './Context';
import { actions } from './reducer';
import { getComponent } from './componentUtil';
import { useComponent } from './useComponent';

export interface ComponentWrapperProps {
  active: boolean;
  item: ComponentData;
}

function ComponentWrapper({ active, item }: ComponentWrapperProps) {
  const { id, type, left, top, width, height, data } = item;

  const dispatch = useEditor();

  // 选中组件
  const handleSelect = (evt: React.MouseEvent) => {
    dispatch(evt.shiftKey ? actions.selectMultiple(id) : actions.selectSingle(id));
  };

  // 拖动过程忽略历史记录
  const handleMove: DraggableHandler = coreData => {
    // TODO: 上和左边, 不让为负值
    dispatch(
      actions.updateWithoutHistory(prev => {
        return {
          left: prev.left + coreData.deltaX,
          top: prev.top + coreData.deltaY,
        };
      })
    );
  };

  // 停止后记录历史
  const handleStop: DraggableHandler = () => {
    dispatch(actions.recordHistory());
  };

  const component = useComponent({ type, data });

  const style: React.CSSProperties = {
    ...getComponent(type).wrapperStyle,
    position: 'absolute',
    left,
    top,
    width,
    height,
  };

  const classNames = classnames('pe-component-wrapper', {
    active,
  });

  return (
    <Draggable
      cancel=".js-drag-cancel"
      onMouseDown={handleSelect}
      onMove={handleMove}
      onStop={handleStop}
    >
      <div className={classNames} style={style} data-id={item.id}>
        {component}
      </div>
    </Draggable>
  );
}

export default React.memo(ComponentWrapper);
