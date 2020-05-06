import React, { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { rafThrottle } from '@/utils/rafThrottle';

export function parentToSelector(el: Element, selector: string, baseNode: Element): boolean {
  let node: Element | null = el;
  while (node) {
    if (node.matches(selector)) return true;
    if (node === baseNode) return false;
    node = node.parentElement;
  }
  return false;
}

export function offsetFromParent(
  evt: { clientX: number; clientY: number },
  offsetParent: Element,
  scale = 1
) {
  const isBody = offsetParent === document.body;
  const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();
  const x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
  const y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;

  return { x, y };
}

export interface DraggableData {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
}

interface UseDraggable<T> {
  handle?: string;
  cancel?: string;
  onStart?: (evt: React.MouseEvent, data: DraggableData) => any;
  onMove: (data: DraggableData) => void;
  onStop?: (data: DraggableData) => void;
  ref: React.RefObject<T>;
}

export function useDraggable<T extends HTMLElement = HTMLDivElement>(props: UseDraggable<T>) {
  const { onStart, onMove, onStop, handle, cancel, ref } = props;

  const data = useRef({
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
  });
  const [dragging, setDragging] = useState(false);

  const onMouseDown = useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
      const currentTarget = evt.currentTarget as HTMLElement;
      const target = evt.target as HTMLElement;
      if (!ref.current) return;
      // 只接受左键
      if (typeof evt.button === 'number' && evt.button !== 0) return;
      if (handle && !parentToSelector(target, handle, currentTarget)) return;
      if (cancel && parentToSelector(target, cancel, currentTarget)) return;
      const position = offsetFromParent(evt, ref.current.offsetParent!);
      data.current.x = position.x;
      data.current.y = position.y;
      data.current.deltaX = 0;
      data.current.deltaY = 0;
      if (onStart && onStart(evt, data.current) === false) return;
      setDragging(true);
    },
    [cancel, handle, onStart, ref]
  );

  useLayoutEffect(() => {
    const onMouseMove = rafThrottle((evt: MouseEvent) => {
      if (!dragging) return;
      if (!ref.current) return;
      if (!ref.current.offsetParent) return;
      const { x, y } = offsetFromParent(evt, ref.current.offsetParent);
      data.current.deltaX = x - data.current.x;
      data.current.deltaY = y - data.current.y;
      data.current.x = x;
      data.current.y = y;
      onMove(data.current);
    });
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
    }
    return () => {
      if (dragging) {
        window.removeEventListener('mousemove', onMouseMove);
      }
    };
  }, [dragging, onMove, ref]);

  useLayoutEffect(() => {
    const onMouseUp = () => {
      if (!dragging) return;
      if (!ref.current) return;
      setDragging(false);
      if (onStop) {
        onStop(data.current);
      }
    };
    if (dragging) {
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      if (dragging) {
        window.removeEventListener('mouseup', onMouseUp);
      }
    };
  }, [dragging, onStop, ref]);

  useLayoutEffect(() => {
    let orginal: string;
    if (dragging) {
      orginal = document.body.style.userSelect;
      document.body.style.userSelect = 'none';
    }
    return () => {
      if (dragging) {
        document.body.style.userSelect = orginal;
      }
    };
  }, [dragging]);

  return { onMouseDown, dragging };
}
