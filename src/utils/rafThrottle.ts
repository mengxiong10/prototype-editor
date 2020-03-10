export function rafThrottle<T extends any[]>(fn: (...args: T) => void) {
  let running = false;
  return function fnRaf(this: any, ...args: T) {
    if (running) return;
    running = true;
    requestAnimationFrame(() => {
      running = false;
      fn.apply(this, args);
    });
  };
}
