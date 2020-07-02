import { castArray } from 'lodash';
import type { ComponentData, ComponentId } from 'src/types/editor';
import type { ShapeData } from 'src/components/DrawShape';
import { createReducerWithActions } from './reducerHelpers';
import type { Store } from './index';

type SelectHandler<T = void> = (state: ComponentId[], payload: T, s: Store) => ComponentId[];

const add: SelectHandler<ComponentData | ComponentData[]> = (state, payload) => {
  return castArray(payload).map((v) => v.id);
};

const select: SelectHandler<ComponentId | ComponentId[]> = (state, payload) => {
  return castArray(payload);
};

const selectAppend: SelectHandler<ComponentId | ComponentId[]> = (state, payload) => {
  return state.concat(payload);
};

const selectArea: SelectHandler<ShapeData> = (state, payload, store) => {
  const { left, top, width, height } = payload;
  return store.data.present
    .filter((v) => {
      const { left: l, top: t, width: w, height: h } = v;
      return left <= l && top <= t && left + width >= l + w && top + height >= t + h;
    })
    .map((v) => v.id);
};

const selectAll: SelectHandler = (state, payload, store) => {
  return store.data.present.map((v) => v.id);
};

const handlers = {
  add,
  select,
  selectAppend,
  selectAll,
  selectArea,
};

export const { reducer, actions } = createReducerWithActions(handlers);
