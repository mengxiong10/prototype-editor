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

  // 拖动过程忽略历史记录
  const handleMove: DraggableHandler = coreData => {
    dispatch(
      actions.updateWithoutHistory({
        rect: prev => {
          return {
            left: prev.left + coreData.deltaX,
            top: prev.top + coreData.deltaY,
          };
        },
      })
    );
  };

  // 停止后记录历史
  const handleStop: DraggableHandler = () => {
    // 更新一个空对象, 直接返回当前state, 如果之前data有变化, undoable就会把当前值入栈, 如果之前值没变化, 不会更新
    // https://github.com/omnidan/redux-undo/blob/b4edbb3603/src/reducer.js#L208
    dispatch(actions.update({}));
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
    <Draggable onMouseDown={handleSelect} onMove={handleMove} onStop={handleStop}>
      <div className={classNames} style={style} data-id={item.id}>
        {component}
      </div>
    </Draggable>
  );
}

export default React.memo(ComponentWrapper);
