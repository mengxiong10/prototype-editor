import type { ComponentData } from 'src/types/editor';
import { createReducerWithActions } from './reducerHelpers';
import type { SliceReducerHandler } from './type';

type ClipboardHandler<P = void> = SliceReducerHandler<ComponentData[], P>;

const copy: ClipboardHandler = (state, payload, { data, selected }) => {
  return data.present.filter((v) => selected.indexOf(v.id) !== -1);
};

const cut = copy;

const handlers = {
  copy,
  cut,
};

export const { reducer, actions } = createReducerWithActions(handlers);
