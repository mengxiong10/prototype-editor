import React, { useState, useLayoutEffect, RefObject } from 'react';
import { rafThrottle } from '@/utils/rafThrottle';

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

const getPosition = (
  { clientX, clientY }: { clientX: number; clientY: number },
  target: Element
) => {
  const rect = target.getBoundingClientRect();
  let x = clientX - rect.left + target.scrollLeft;
  let y = clientY - rect.top + target.scrollTop;
  const maxWidth = target.scrollWidth;
  const maxHeight = target.scrollHeight;
  x = Math.max(0, x);
  x = Math.min(x, maxWidth);
  y = Math.max(0, y);
  y = Math.min(y, maxHeight);
  return { x, y };
};

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
  const { children, shapeStyle, style, onMove, onStop, onMouseDown, ...rest } = props;

  const [rect, setRect] = useState({ x1: 0, x2: 0, y1: 0, y2: 0 });
  const [dragging, setDragging] = useState(false);

  const handleStart = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseDown) {
      onMouseDown(evt);
    }
    const { target, currentTarget, button } = evt;
    // 只响应左键
    if (typeof button === 'number' && button !== 0) {
      return;
    }
    // 不响应冒泡
    if (target !== currentTarget) {
      return;
    }
    const { x, y } = getPosition(evt, currentTarget);
    setDragging(true);
    setRect({ x1: x, y1: y, x2: x, y2: y });
  };

  useLayoutEffect(() => {
    const handleMove = rafThrottle((evt: MouseEvent) => {
      if (!dragging || !ref.current) {
        return;
      }
      const { x, y } = getPosition(evt, ref.current);
      setRect(prev => {
        const next = { ...prev, x2: x, y2: y };
        if (onMove) {
          onMove(getStyle(next));
        }
        return next;
      });
    });

    const handleStop = () => {
      if (!dragging || !ref.current) {
        return;
      }
      setDragging(false);
      setRect(prev => {
        if (onStop) {
          onStop(getStyle(prev));
        }
        return { x1: 0, y1: 0, x2: 0, y2: 0 };
      });
    };
    if (dragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleStop);
    }
    return () => {
      if (dragging) {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleStop);
      }
    };
  }, [dragging, onMove, onStop, ref]);

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
    <div
      {...rest}
      ref={ref}
      onMouseDown={handleStart}
      style={dragging ? { ...style, userSelect: 'none' } : style}
    >
      {children}
      {shapeElement}
    </div>
  );
}

export default React.forwardRef(DrawShape);
