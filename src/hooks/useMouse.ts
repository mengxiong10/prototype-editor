import { useEffect, useRef } from 'react';

export function useMouse() {
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (evt: MouseEvent) => {
      position.current.x = evt.clientX;
      position.current.y = evt.clientY;
    };
    document.addEventListener('mousemove', handleMove);
    return () => {
      document.addEventListener('mousemove', handleMove);
    };
  }, []);

  return position.current;
}
