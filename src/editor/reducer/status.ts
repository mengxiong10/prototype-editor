import type { ComponentStatusMap } from 'src/types/editor';
import omit from 'object.omit';
import { createReducerWithActions } from './reducerHelpers';
import type { Store } from './index';

type StatusHandler<T> = (state: ComponentStatusMap, payload: T, s: Store) => ComponentStatusMap;

const setStatus: StatusHandler<ComponentStatusMap> = (state, payload) => {
  return { ...state, ...payload };
};

const deleteStatus: StatusHandler<string> = (state, payload) => {
  if (state[payload]) {
    return omit(state, payload);
  }
  return state;
};

const handlers = {
  setStatus,
  deleteStatus,
};

export const { reducer, actions } = createReducerWithActions(handlers);
