import React from 'react';
import classnames from 'classnames';
import Draggable, { DraggableHandler } from 'src/components/Draggable';
import type { ComponentData, ComponentStatus } from 'src/types/editor';
import { closestUntil } from 'src/utils/domFns';
import { useEditor, ComponentIdContext } from './Context';
import { actions } from './reducer';
import { getComponent } from './componentUtil';
import { useComponent } from './useComponent';
import { disableClassnames } from './DisableEditorFeature';
import { childComponentClassName } from './ChildComponentWrapper';

export interface ComponentWrapperProps {
  active: boolean;
  item: ComponentData;
  status?: ComponentStatus;
}

function ComponentWrapper({ active, item, status }: ComponentWrapperProps) {
  const { id, type, left, top, width, height, data } = item;

  const dispatch = useEditor();

  if (!active && status) {
    dispatch(actions.deleteStatus(item.id));
  }

  const handleDoubleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    const child = closestUntil(
      evt.target as HTMLElement,
      `.${childComponentClassName}`,
      evt.currentTarget
    );
    if (child && child.dataset.path && child.dataset.type) {
      dispatch(
        actions.setStatus({
          [id]: {
            selectedPath: child.dataset.path,
            selectedType: child.dataset.type,
          },
        })
      );
    } else {
      dispatch(actions.deleteStatus(id));
    }
    dispatch(actions.select(id));
  };

  // 选中组件
  const handleSelect = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (!active) {
      dispatch(evt.ctrlKey ? actions.selectAppend(id) : actions.select(id));
    }
  };

  // 拖动过程忽略历史记录
  const handleMove: DraggableHandler = (coreData) => {
    // TODO: 上和左边, 不让为负值
    dispatch(
      actions.updateWithoutHistory((prev) => {
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
    <ComponentIdContext.Provider value={id}>
      <Draggable
        cancel={`.${disableClassnames.drag}`}
        onMouseDown={handleSelect}
        onMove={handleMove}
        onStop={handleStop}
      >
        <div
          onDoubleClick={handleDoubleClick}
          className={classNames}
          style={style}
          data-id={item.id}
        >
          {component}
        </div>
      </Draggable>
    </ComponentIdContext.Provider>
  );
}

export default React.memo(ComponentWrapper);
