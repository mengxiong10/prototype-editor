import { useRef } from 'react';
import { useHotkeys } from '../hooks/useHotkeys';
import { useEditor } from './Context';
import { actions, pasteComponentData } from './reducer';

export function useShortcuts() {
  const dispatch = useEditor();

  const position = useRef({ x: 0, y: 0 });

  const onMouseMove = (evt: React.MouseEvent) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    position.current.x = evt.clientX - rect.left;
    position.current.y = evt.clientY - rect.top;
  };

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

  return { onMouseMove };
}
