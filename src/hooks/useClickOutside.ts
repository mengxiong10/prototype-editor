import { useRef, useEffect } from 'react';

interface ClickOutsideProps {
  onClick: (evt: MouseEvent) => void;
  eventName?: 'click' | 'mousedown';
}

export function useClickOutside<T extends Element = HTMLDivElement>({
  onClick,
  eventName = 'mousedown',
}: ClickOutsideProps) {
  const node = useRef<T>(null);

  const saveCallback = useRef(onClick);

  useEffect(() => {
    saveCallback.current = onClick;
  }, [onClick]);

  useEffect(() => {
    const handleClick = (evt: MouseEvent) => {
      const { current } = node;
      if (!current || current.contains(evt.target as Element)) {
        return;
      }
      saveCallback.current(evt);
    };

    document.addEventListener(eventName, handleClick);
    return () => {
      document.addEventListener(eventName, handleClick);
    };
  }, [eventName]);

  return node;
}
