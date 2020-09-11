import type { SetStateAction } from 'react';
import type { SliceReducerHandler } from 'src/editor/type';

type ScaleHandler<P = void> = SliceReducerHandler<number, P>;

export const scale: ScaleHandler<SetStateAction<number>> = (state, payload) => {
  if (typeof payload === 'function') {
    return payload(state);
  }
  return payload;
};
