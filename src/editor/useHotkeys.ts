import hotkeys, { KeyHandler } from 'hotkeys-js';
import { useCallback, useEffect } from 'react';
import { matchesSelectorAndParentsTo } from 'src/utils/domFns';
import { disableClassnames } from './DisableEditorFeature';

const defaultFilter = hotkeys.filter;

hotkeys.filter = function filter(evt: KeyboardEvent) {
  const target = evt.target as Element;

  const classname = disableClassnames.keyboardShortcut;

  return defaultFilter(evt) && !matchesSelectorAndParentsTo(target, `.${classname}`);
};

export function useHotkeys(keys: string, callback: KeyHandler, deps: any[] = []) {
  const memoisedCallback = useCallback(callback, deps);

  useEffect(() => {
    hotkeys(keys, memoisedCallback);

    return () => hotkeys.unbind(keys, memoisedCallback);
  }, [keys, memoisedCallback]);
}
