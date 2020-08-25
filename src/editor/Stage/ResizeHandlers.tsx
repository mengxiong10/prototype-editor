import React, { useRef } from 'react';
import type { ComponentData } from 'src/types/editor';
import Draggable, { DraggableHandler } from 'src/components/Draggable';
import { useEditor } from 'src/editor/Context';
import { actions } from 'src/editor/reducer';

interface ResizeHandlersProps {
  selectedData: ComponentData[];
}

const handlers = ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'];

function ResizeHandlers({ selectedData }: ResizeHandlersProps) {
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

  const outerLeft = Math.min(...selectedData.map((v) => v.left));
  const outerTop = Math.min(...selectedData.map((v) => v.top));
  const outerRight = Math.max(...selectedData.map((v) => v.left + v.width));
  const outerBottom = Math.max(...selectedData.map((v) => v.top + v.height));
  const outerWidth = outerRight - outerLeft;
  const outerHeight = outerBottom - outerTop;
  const minWidth = Math.min(...selectedData.map((v) => v.width));
  const minHeight = Math.min(...selectedData.map((v) => v.height));

  const minOuterWidth = (outerWidth / minWidth) * 50; // 100默认的组件最小宽度;
  const minOuterHeight = (outerHeight / minHeight) * 20; // 20 默认组件最小高度;

  const handleDragStart = (evt: React.MouseEvent) => {
    const node = evt.target as HTMLSpanElement;
    const d = node.dataset.handler!;
    resizeData.current = {
      canResizeWidth: d !== 'n' && d !== 's',
      canResizeHeight: d !== 'e' && d !== 'w',
      isResizeLeft: d[d.length - 1] === 'w',
      isResizeTop: d[0] === 'n',
    };

    const cursor = window.getComputedStyle(node).getPropertyValue('cursor');
    document.body.style.cursor = cursor;
    slack.current.x = 0;
    slack.current.y = 0;
  };

  const handleMove: DraggableHandler = (coreData) => {
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
      actions.updateWithoutHistory((prev) => {
        const width = radioWidth * prev.width;
        const height = radioHeight * prev.height;
        const top = radioHeight * (prev.top - outerTop) + nextOuterTop;
        const left = radioWidth * (prev.left - outerLeft) + nextOuterLeft;
        return { width, height, top, left };
      })
    );
  };

  const handleStop: DraggableHandler = () => {
    document.body.style.cursor = '';
    dispatch(actions.recordHistory());
  };

  return (
    <Draggable
      handle=".resizable-handle"
      onMove={handleMove}
      onStop={handleStop}
      onStart={handleDragStart}
    >
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
        {handlers.map((d) => (
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
