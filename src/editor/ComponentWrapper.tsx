import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { usePrevious } from 'my-react-common';
import classnames from 'classnames';
import { DraggableCore, DraggableEventHandler, DraggableData } from 'react-draggable';
import { ComponentRect, ComponentData } from '@/types/editor';
import { useEditor } from './Context';
import { actions } from './reducer';
import { getComponent } from './registerComponents';
import { componentDragEvent, componentDragStopEvent } from './event';

export interface ComponentWrapperProps {
  active: boolean;
  item: ComponentData;
}

export interface ResizeStatus {
  isResize: boolean;
  isResizeLeft: boolean;
  isResizeTop: boolean;
  canResizeWidth: boolean;
  canResizeHeight: boolean;
}

const defaultResizeHandles = ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'];
// 组件的最小尺寸, 也可以设置为prop 等方式 自定义 传递
const minWidth = 40;
const minHeight = 20;

function ComponentWrapper({ active, item }: ComponentWrapperProps) {
  const { rect, id, type, data: componentData } = item;

  const dispatch = useEditor();

  const [innerRect, setInnerRect] = useState(rect);
  const prevRect = usePrevious(rect);
  // 同步Rect
  if (prevRect && prevRect !== rect && rect !== innerRect) {
    setInnerRect(rect);
  }

  const resizeStatus = useRef<ResizeStatus>({
    isResize: false,
    isResizeLeft: false,
    isResizeTop: false,
    canResizeWidth: false,
    canResizeHeight: false,
  });

  const slack = useRef({ x: 0, y: 0 });

  // 拖动, 触发事件, 让所有active状态的组件更新
  const handleDrag: DraggableEventHandler = (e, data) => {
    componentDragEvent.emit({ data, status: resizeStatus.current });
  };

  // 拖动结束, 触发事件, 让所有active状态的组件向上同步组件
  const handleStop = () => {
    resizeStatus.current.isResize = false;
    // 如果移动过, 同步数据到顶层
    if (rect !== innerRect) {
      // 因为这里的onStop事件不是react自带的事件系统触发的, 而是监听的window.addEventListener
      // 所以如果不加batchedUpdates, 所有的dispatch不会合并提交, 会导致重复渲染
      ReactDOM.unstable_batchedUpdates(() => {
        componentDragStopEvent.emit();
      });
    }
  };

  // resize 开始的时候记录 resize的 状态
  const handleResizeHandleClick = (evt: React.MouseEvent<HTMLSpanElement>) => {
    const node = evt.currentTarget;
    const d = node.dataset.handle!;
    resizeStatus.current = {
      isResize: true,
      canResizeWidth: d !== 'n' && d !== 's',
      canResizeHeight: d !== 'e' && d !== 'w',
      isResizeLeft: d[d.length - 1] === 'w',
      isResizeTop: d[0] === 'n',
    };
  };

  // 选中组件
  const handleSelect = () => {
    dispatch(actions.select(id));
  };

  // 组件drag的监听处理
  useEffect(() => {
    const move = (prevState: ComponentRect, data: DraggableData) => {
      return {
        ...prevState,
        left: prevState.left + data.deltaX,
        top: prevState.top + data.deltaY,
      };
    };

    const resize = (prevState: ComponentRect, data: DraggableData, status: ResizeStatus) => {
      const { isResizeLeft, isResizeTop, canResizeHeight, canResizeWidth } = status;
      const deltaX = isResizeLeft ? -data.deltaX : data.deltaX;
      const deltaY = isResizeTop ? -data.deltaY : data.deltaY;
      const width = prevState.width + (canResizeWidth ? deltaX : 0);
      let nextWidth = width + slack.current.x;
      nextWidth = Math.max(nextWidth, minWidth);
      slack.current.x += width - nextWidth;
      const height = prevState.height + (canResizeHeight ? deltaY : 0);
      let nextHeight = height + slack.current.y;
      nextHeight = Math.max(nextHeight, minHeight);
      slack.current.y += height - nextHeight;

      const nextLeft = isResizeLeft
        ? prevState.left + (prevState.width - nextWidth)
        : prevState.left;
      const nextTop = isResizeTop ? prevState.top + (prevState.height - nextHeight) : prevState.top;

      return {
        width: nextWidth,
        height: nextHeight,
        left: nextLeft,
        top: nextTop,
      };
    };

    if (active) {
      return componentDragEvent.on(({ data, status }) => {
        setInnerRect(prevState => {
          if (status.isResize) {
            return resize(prevState, data, status);
          }
          return move(prevState, data);
        });
      });
    }

    return undefined;
  }, [active]);

  // 组件dragStop的建听处理
  useEffect(() => {
    if (active) {
      return componentDragStopEvent.on(() => {
        slack.current.x = 0;
        slack.current.y = 0;
        dispatch(
          actions.update({
            id,
            rect: innerRect,
          })
        );
      });
    }

    return undefined;
  }, [active, dispatch, id, innerRect]);

  const component = useMemo(() => {
    const componentOption = getComponent(type);

    return React.createElement(componentOption.component, {
      ...componentOption.defaultData,
      ...componentData,
    });
  }, [componentData, type]);

  const style: React.CSSProperties = {
    ...getComponent(type).wrapperStyle,
    ...innerRect,
    position: 'absolute',
  };
  const classNames = classnames('pe-component-wrapper', {
    resizable: active,
  });

  const resizeHandles = active ? defaultResizeHandles : [];

  return (
    <DraggableCore
      onMouseDown={handleSelect}
      onDrag={handleDrag}
      onStop={handleStop}
      cancel=".js-drag-cancel"
    >
      <div className={classNames} style={style} data-id={item.id}>
        {component}
        {resizeHandles.map(d => (
          <span
            key={d}
            data-handle={d}
            onMouseDown={handleResizeHandleClick}
            className={`resizable-handle resizable-handle-${d}`}
          ></span>
        ))}
      </div>
    </DraggableCore>
  );
}

export default React.memo(ComponentWrapper);
