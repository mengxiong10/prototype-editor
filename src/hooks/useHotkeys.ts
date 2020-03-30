import hotkeys, { KeyHandler } from 'hotkeys-js';
import { useCallback, useEffect } from 'react';

export function useHotkeys(keys: string, callback: KeyHandler, deps: any[] = []) {
  const memoisedCallback = useCallback(callback, deps);

  useEffect(() => {
    hotkeys(keys, memoisedCallback);

    return () => hotkeys.unbind(keys, memoisedCallback);
  }, [keys, memoisedCallback]);
}
