import React, { useState, RefObject, useCallback } from 'react';
import { DraggableData, useDraggable } from '@/hooks/useDraggable';

export interface ShapeData {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type ShapeRectHandler = (data: ShapeData) => void;

export interface DrawShapeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  shapeStyle?: React.CSSProperties;
  onMove?: ShapeRectHandler;
  onStop?: ShapeRectHandler;
}

const getStyle = ({ x1, x2, y1, y2 }: { x1: number; x2: number; y1: number; y2: number }) => {
  const left = Math.min(x1, x2);
  const top = Math.min(y1, y2);
  const width = Math.abs(x1 - x2);
  const height = Math.abs(y1 - y2);
  return { left, top, width, height };
};

const defaultShapeStyle = {
  backgroundColor: 'rgba(16, 142, 233, 0.05)',
  border: '1px solid #108ee9',
};

function DrawShape(props: DrawShapeProps, ref: RefObject<HTMLDivElement>) {
  const { children, shapeStyle, onMove, onStop, onMouseDown, ...rest } = props;

  const [rect, setRect] = useState({ x1: 0, x2: 0, y1: 0, y2: 0 });

  const handleStart = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>, data: DraggableData) => {
      if (onMouseDown) {
        onMouseDown(evt);
      }
      const { target, currentTarget } = evt;
      // 不响应冒泡
      if (target !== currentTarget) {
        return false;
      }
      const { x, y } = data;
      setRect({ x1: x, y1: y, x2: x, y2: y });
      return true;
    },
    [onMouseDown]
  );

  const handleMove = useCallback(
    ({ x, y }: DraggableData) => {
      setRect(prev => {
        const next = { ...prev, x2: x, y2: y };
        if (onMove) {
          onMove(getStyle(next));
        }
        return next;
      });
    },
    [onMove]
  );

  const handleStop = useCallback(() => {
    setRect(prev => {
      if (onStop) {
        onStop(getStyle(prev));
      }
      return { x1: 0, y1: 0, x2: 0, y2: 0 };
    });
  }, [onStop]);

  const { dragging, onMouseDown: handleMouseDown } = useDraggable({
    onStart: handleStart,
    onMove: handleMove,
    onStop: handleStop,
    ref,
  });

  const shapeElement = dragging && (
    <div
      key="dragSelect"
      style={{
        ...getStyle(rect),
        ...(shapeStyle || defaultShapeStyle),
        position: 'absolute',
      }}
    />
  );

  return (
    <div {...rest} ref={ref} onMouseDown={handleMouseDown}>
      {children}
      {shapeElement}
    </div>
  );
}

export default React.forwardRef(DrawShape);
