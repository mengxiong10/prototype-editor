import { useRef, useEffect } from 'react';
import { useHotkeys } from './useHotkeys';
import { useEditor } from './Context';

export function useShortcuts(ref: React.RefObject<HTMLElement>) {
  const execCommand = useEditor();

  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (evt: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      // TODO: 还要计算ref.current 的滚动
      position.current.x = evt.clientX - rect.left;
      position.current.y = evt.clientY - rect.top;
    };
    document.addEventListener('mousemove', handleMove);
    return () => {
      document.addEventListener('mousemove', handleMove);
    };
  }, [ref]);

  useHotkeys('delete', () => {
    execCommand('del');
  });

  useHotkeys('ctrl+x', () => {
    execCommand('cut');
  });

  useHotkeys('ctrl+c', () => {
    execCommand('copy');
  });

  useHotkeys('ctrl+v', () => {
    execCommand('paste', position.current);
  });

  useHotkeys('ctrl+a', () => {
    execCommand('selectAll');
  });

  useHotkeys('ctrl+shift+up', () => {
    execCommand('sortToTop');
  });

  useHotkeys('ctrl+shift+down', () => {
    execCommand('sortToBottom');
  });

  useHotkeys('ctrl+z', () => {
    execCommand('undo');
  });

  useHotkeys('ctrl+shift+z', () => {
    execCommand('redo');
  });
}
