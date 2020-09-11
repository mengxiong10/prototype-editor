import React from 'react';
import classnames from 'classnames';
import Draggable, { DraggableHandler } from 'src/components/Draggable';
import type { ComponentData } from 'src/editor/type';
import { useEditor, ComponentIdContext } from 'src/editor/Context';
import { getComponent } from 'src/editor/componentUtil';
import { disableClassnames } from 'src/editor/DisableEditorFeature';
import { EventCompositeSelect } from 'src/editor/event';
import { useComponent } from 'src/editor/useComponent';
import { compositWrapperClassName } from './CompositeWrapper';

export interface ComponentWrapperProps {
  active: boolean;
  item: ComponentData;
  scale?: number;
}

export const componentWrapperClassName = 'js-component-wrapper';

function ComponentWrapper({ active, item, scale = 1 }: ComponentWrapperProps) {
  const { id, type, left, top, width, height, data, children } = item;

  const execCommand = useEditor();

  // 选中组件
  const handleSelect = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (!active) {
      execCommand(evt.ctrlKey ? 'selectAppend' : 'select', id);
    }
  };

  const handleComponentClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget } = evt;
    let el: HTMLElement = evt.target as HTMLElement;
    while (el !== currentTarget && !el.classList.contains(compositWrapperClassName)) {
      el = el.parentElement!;
    }

    if (el === currentTarget) {
      // 清除复合组件的状态, 其余的清除在PanelDetail里面实现
      EventCompositeSelect.emit(null);
    } else {
      EventCompositeSelect.emit({ path: el.dataset.path!, type: el.dataset.type!, id });
    }
  };

  // 拖动过程忽略历史记录
  const handleMove: DraggableHandler = (coreData) => {
    // TODO: 上和左边, 不让为负值
    execCommand('updateWithoutHistory', (prev) => {
      return {
        left: prev.left + coreData.deltaX,
        top: prev.top + coreData.deltaY,
      };
    });
  };

  // 停止后记录历史
  const handleStop: DraggableHandler = () => {
    execCommand('recordHistory');
  };

  const style: React.CSSProperties = {
    ...getComponent(type).wrapperStyle,
    position: 'absolute',
    left,
    top,
    width,
    height,
  };

  const classNames = classnames('pe-component-wrapper', componentWrapperClassName, {
    active,
  });

  const component = useComponent({ data, type, children });

  return (
    <ComponentIdContext.Provider value={id}>
      <Draggable
        cancel={`.${disableClassnames.drag}`}
        onMouseDown={handleSelect}
        onMove={handleMove}
        onStop={handleStop}
        scale={scale}
      >
        <div
          onClickCapture={handleComponentClick}
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
