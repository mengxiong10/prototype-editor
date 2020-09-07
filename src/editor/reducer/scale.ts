import type { SetStateAction } from 'react';
import { createReducerWithActions } from './reducerHelpers';
import type { SliceReducerHandler } from './type';

type ScaleHandler<P = void> = SliceReducerHandler<number, P>;

const setScale: ScaleHandler<SetStateAction<number>> = (state, payload) => {
  if (typeof payload === 'function') {
    return payload(state);
  }
  return payload;
};

const handlers = {
  setScale,
};

export const { reducer, actions } = createReducerWithActions(handlers);
