import React, { useCallback, useRef } from 'react';
import cx from 'classnames';
import { ComponentRect } from '@/types/editor';
import { useEditor } from './Context';
import { actions } from './reducer';
import { useDraggable, DraggableData } from '@/hooks/useDraggable';

export interface ComponentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  id: string;
  rect: ComponentRect;
  children: React.ReactNode;
}

type ResizeHandle = 'n' | 'e' | 's' | 'w' | 'nw' | 'ne' | 'se' | 'sw';

const defaultResizeHandles: ResizeHandle[] = ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'];

function ComponentWrapper({ active, rect, id, children }: ComponentWrapperProps) {
  const dispatch = useEditor();

  const ref = useRef<HTMLDivElement>(null);

  const handleMoveStart = useCallback((evt: React.MouseEvent) => {
    return evt.currentTarget !== evt.target;
  }, []);

  const handleMove = useCallback(
    ({ deltaX, deltaY }: DraggableData) => {
      dispatch(
        actions.update({
          id,
          rect: {
            left: prev => prev + deltaX,
            top: prev => prev + deltaY,
          },
        })
      );
    },
    [dispatch, id]
  );

  const moveProps = useDraggable({
    onStart: handleMoveStart,
    onMove: handleMove,
    cancel: '.js-drag-cancel',
    ref,
  });
  // 记录resize开始的状态
  const resizeStatus = useRef({
    canResizeWidth: false,
    canResizeHeight: false,
    isLeft: false,
    isTop: false,
  });
  const handleResizeStart = useCallback((evt: React.MouseEvent<HTMLSpanElement>) => {
    const node = evt.currentTarget;
    const d = node.dataset.handle!;
    const canResizeWidth = d !== 'n' && d !== 's';
    const canResizeHeight = d !== 'e' && d !== 'w';
    const isLeft = d[d.length - 1] === 'w';
    const isTop = d[0] === 'n';
    resizeStatus.current = { canResizeWidth, canResizeHeight, isLeft, isTop };
  }, []);

  const handleResize = useCallback(
    ({ deltaX, deltaY }: DraggableData) => {
      const { canResizeHeight, canResizeWidth, isLeft, isTop } = resizeStatus.current;
      deltaX = isLeft ? -deltaX : deltaX;
      deltaY = isTop ? -deltaY : deltaY;
      dispatch(
        actions.update({
          id,
          rect: {
            width: prev => prev + (canResizeWidth ? deltaX : 0),
            height: prev => prev + (canResizeHeight ? deltaY : 0),
            left: prev => prev + (canResizeWidth && isLeft ? -deltaX : 0),
            top: prev => prev + (canResizeHeight && isTop ? -deltaY : 0),
          },
        })
      );
    },
    [dispatch, id]
  );

  const resizeProps = useDraggable({
    onMove: handleResize,
    onStart: handleResizeStart,
    ref,
  });

  const className = cx('pe-component-wrapper', {
    resizable: active,
  });

  const resizeHandles = active ? defaultResizeHandles : [];

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'absolute', ...rect }}
      data-id={id}
      onMouseDown={moveProps.onMouseDown}
    >
      {children}
      {resizeHandles.map(d => (
        <span
          key={d}
          onMouseDown={resizeProps.onMouseDown}
          data-handle={d}
          className={`resizable-handle resizable-handle-${d} js-drag-cancel`}
        ></span>
      ))}
    </div>
  );
}

export default React.memo(ComponentWrapper);
