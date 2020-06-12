import hotkeys, { KeyHandler } from 'hotkeys-js';
import { useCallback, useEffect } from 'react';
import { matchesSelectorAndParentsTo } from '@/utils/domFns';
import { disableShortcutClassName } from './config';

const defaultFilter = hotkeys.filter;

hotkeys.filter = function filter(evt: KeyboardEvent) {
  const target = evt.target as Element;

  return defaultFilter(evt) && !matchesSelectorAndParentsTo(target, `.${disableShortcutClassName}`);
};

export function useHotkeys(keys: string, callback: KeyHandler, deps: any[] = []) {
  const memoisedCallback = useCallback(callback, deps);

  useEffect(() => {
    hotkeys(keys, memoisedCallback);

    return () => hotkeys.unbind(keys, memoisedCallback);
  }, [keys, memoisedCallback]);
}
