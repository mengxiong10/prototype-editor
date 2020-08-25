import React, { useMemo } from 'react';
import classnames from 'classnames';
import Draggable, { DraggableHandler } from 'src/components/Draggable';
import type { ComponentData } from 'src/types/editor';
import { useEditor, ComponentIdContext } from 'src/editor/Context';
import { actions } from 'src/editor/reducer';
import { getComponent } from 'src/editor/componentUtil';
import { disableClassnames } from 'src/editor/DisableEditorFeature';
import { EventCompositeSelect } from 'src/editor/event';
import { mergeObjectDeep } from 'src/utils/object';

export interface ComponentWrapperProps {
  active: boolean;
  item: ComponentData;
}

function ComponentWrapper({ active, item }: ComponentWrapperProps) {
  const { id, type, left, top, width, height, data } = item;

  const dispatch = useEditor();

  // 选中组件
  const handleSelect = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (!active) {
      dispatch(evt.ctrlKey ? actions.selectAppend(id) : actions.select(id));
    }
  };

  const handleComponentClick = () => {
    // 清除复合组件的状态, 其余的清除在PanelDetail里面实现
    EventCompositeSelect.emit(null);
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

  const component = useMemo(() => {
    const componentOption = getComponent(type);

    return React.createElement(
      componentOption.component,
      mergeObjectDeep(componentOption.defaultData, data)
    );
  }, [data, type]);

  return (
    <ComponentIdContext.Provider value={id}>
      <Draggable
        cancel={`.${disableClassnames.drag}`}
        onMouseDown={handleSelect}
        onMove={handleMove}
        onStop={handleStop}
      >
        <div onClick={handleComponentClick} className={classNames} style={style} data-id={item.id}>
          {component}
        </div>
      </Draggable>
    </ComponentIdContext.Provider>
  );
}

export default React.memo(ComponentWrapper);
