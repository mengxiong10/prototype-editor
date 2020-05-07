import { useRef, useEffect } from 'react';
import { useHotkeys } from '../hooks/useHotkeys';
import { useEditor } from './Context';
import { actions, pasteComponentData } from './reducer';

export function useShortcuts(ref: React.RefObject<HTMLElement>) {
  const dispatch = useEditor();

  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (evt: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      position.current.x = evt.clientX - rect.left;
      position.current.y = evt.clientY - rect.top;
    };
    document.addEventListener('mousemove', handleMove);
    return () => {
      document.addEventListener('mousemove', handleMove);
    };
  }, [ref]);

  useHotkeys('delete', () => {
    dispatch(actions.del());
  });

  useHotkeys('ctrl+x', () => {
    dispatch(actions.cut());
  });

  useHotkeys('ctrl+c', () => {
    dispatch(actions.copy());
  });

  useHotkeys('ctrl+v', () => {
    dispatch(actions.add(pasteComponentData(position.current)));
  });

  useHotkeys('ctrl+a', () => {
    dispatch(actions.selectAll());
  });
}
