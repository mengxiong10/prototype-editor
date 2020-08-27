import { castArray } from 'lodash';
import type { ComponentId } from 'src/types/editor';
import type { ShapeData } from 'src/components/DrawShape';
import { createReducerWithActions } from './reducerHelpers';
import type { SliceReducerHandler } from './type';

type SelectHandler<P = void> = SliceReducerHandler<ComponentId[], P>;

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

// TODO: redo, undo的时候也可能添加和删除item, 导致selected的id无效
const del: SelectHandler = () => {
  return [];
};

const handlers = {
  select,
  selectAppend,
  selectAll,
  selectArea,
  del,
  cut: del,
};

export const { reducer, actions } = createReducerWithActions(handlers);
