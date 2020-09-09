import { useHotkeys } from './useHotkeys';
import { useEditor } from './Context';
import { useMouse } from '../hooks/useMouse';

export function useShortcuts(ref: React.RefObject<HTMLElement>) {
  const execCommand = useEditor();

  const position = useMouse();

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
    const currentTarget = ref.current;
    if (!currentTarget) {
      return;
    }
    const rect = currentTarget.getBoundingClientRect();
    const x = position.x - rect.left + currentTarget.scrollLeft;
    const y = position.y - rect.top + currentTarget.scrollTop;
    execCommand('paste', { x, y });
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
