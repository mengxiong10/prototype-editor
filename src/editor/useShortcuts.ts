import { useCallback } from 'react';
import { useEditor, EditorDispatch } from './Context';
import { actions } from './reducer';

interface Shortcut {
  key: string;
  handler: (dispatch: EditorDispatch, evt: React.KeyboardEvent) => void;
}

const shortcuts: Shortcut[] = [
  { key: 'delete', handler: dispatch => dispatch(actions.del()) },
  { key: 'ctrl+a', handler: dispatch => dispatch(actions.selectAll()) },
  { key: 'ctrl+c', handler: dispatch => dispatch(actions.copy()) },
  { key: 'ctrl+v', handler: dispatch => dispatch(actions.paste({ x: 0, y: 0 })) },
  { key: 'ctrl+x', handler: dispatch => dispatch(actions.cut()) },
];

export function useShortcuts() {
  const dispatch = useEditor();

  const handleKeydown = useCallback(
    (evt: React.KeyboardEvent) => {
      const key = evt.key.toLowerCase();
      const item = shortcuts.find(v => {
        const keys = v.key.split(',');
        return keys.some(k => {
          const mods = k.split('+');
          return (
            mods[mods.length - 1] === key &&
            mods.slice(0, -1).every(m => {
              const ek = `${m}Key` as 'ctrlKey' | 'shiftKey' | 'altKey';
              return evt[ek];
            })
          );
        });
      });
      if (item) {
        console.log(item.key);
        evt.preventDefault();
        item.handler(dispatch, evt);
      }
    },
    [dispatch]
  );

  return handleKeydown;
}
