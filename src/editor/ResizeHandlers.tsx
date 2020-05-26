import React, { useRef } from 'react';
import { ComponentData, ComponentId } from '@/types/editor';
import Draggable, { DraggableHandler } from '@/components/Draggable';
import { useEditor } from './Context';
import { actions } from './reducer';

interface ResizeHandlersProps {
  data: ComponentData[];
  selected: ComponentId[];
}

const handlers = ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'];

function ResizeHandlers({ data, selected }: ResizeHandlersProps) {
  const dispatch = useEditor();

  const slack = useRef({
    x: 0,
    y: 0,
  });

  const resizeData = useRef({
    isResizeLeft: false,
    isResizeTop: false,
    canResizeWidth: false,
    canResizeHeight: false,
  });

  const selectedData = data.filter(v => selected.indexOf(v.id) !== -1);
  let [outerLeft, outerTop, outerRight, outerBottom] = [Infinity, Infinity, 0, 0];
  let [minWidth, minHeight] = [Infinity, Infinity];
  selectedData.forEach(v => {
    const { left, top, width, height } = v.rect;
    const bottom = top + height;
    const right = left + width;
    outerLeft = Math.min(outerLeft, left);
    outerTop = Math.min(outerTop, top);
    outerBottom = Math.max(outerBottom, bottom);
    outerRight = Math.max(outerRight, right);
    minWidth = Math.min(minWidth, width);
    minHeight = Math.min(minHeight, height);
  });
  const outerWidth = outerRight - outerLeft;
  const outerHeight = outerBottom - outerTop;

  const minOuterWidth = (outerWidth / minWidth) * 50; // 100默认的组件最小宽度;
  const minOuterHeight = (outerHeight / minHeight) * 20; // 20 默认组件最小高度;

  // TODO: 拖动的时候, 应该设置body的cursor
  const handleDragStart = (evt: React.MouseEvent) => {
    const node = evt.target as HTMLSpanElement;
    const d = node.dataset.handler!;
    resizeData.current = {
      canResizeWidth: d !== 'n' && d !== 's',
      canResizeHeight: d !== 'e' && d !== 'w',
      isResizeLeft: d[d.length - 1] === 'w',
      isResizeTop: d[0] === 'n',
    };

    slack.current.x = 0;
    slack.current.y = 0;
  };

  const handleMove: DraggableHandler = coreData => {
    const { isResizeLeft, isResizeTop, canResizeHeight, canResizeWidth } = resizeData.current;
    let nextWidth = outerWidth;
    let nextHeight = outerHeight;
    if (canResizeWidth) {
      nextWidth += isResizeLeft ? -coreData.deltaX : coreData.deltaX;
    }
    if (canResizeHeight) {
      nextHeight += isResizeTop ? -coreData.deltaY : coreData.deltaY;
    }
    let nextOuterWidth = nextWidth + slack.current.x;
    nextOuterWidth = Math.max(nextOuterWidth, minOuterWidth);
    slack.current.x += nextWidth - nextOuterWidth;
    let nextOuterHeight = nextHeight + slack.current.y;
    nextOuterHeight = Math.max(nextOuterHeight, minOuterHeight);
    slack.current.y += nextHeight - nextOuterHeight;

    if (slack.current.x > 0 && slack.current.y > 0) {
      return;
    }

    const nextOuterLeft = isResizeLeft ? outerLeft + (outerWidth - nextOuterWidth) : outerLeft;
    const nextOuterTop = isResizeTop ? outerTop + (outerHeight - nextOuterHeight) : outerTop;

    const radioWidth = nextOuterWidth / outerWidth;
    const radioHeight = nextOuterHeight / outerHeight;

    dispatch(
      actions.update({
        rect: prev => {
          const width = radioWidth * prev.width;
          const height = radioHeight * prev.height;
          const top = radioHeight * (prev.top - outerTop) + nextOuterTop;
          const left = radioWidth * (prev.left - outerLeft) + nextOuterLeft;
          return { width, height, top, left };
        },
      })
    );
  };

  return (
    <Draggable handle=".resizable-handle" onMove={handleMove} onStart={handleDragStart}>
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          left: outerLeft,
          top: outerTop,
          width: outerWidth,
          height: outerHeight,
          outline: '1px solid #007dfc',
        }}
      >
        {handlers.map(d => (
          <span
            key={d}
            data-handler={d}
            className={`resizable-handle resizable-handle-${d}`}
          ></span>
        ))}
      </div>
    </Draggable>
  );
}

export default ResizeHandlers;
