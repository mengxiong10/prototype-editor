import { createReducerWithActions } from './reducerHelpers';
import { ComponentData, ComponentId } from '@/types/editor';
import { ShapeData } from '@/components/DrawShape';
import { SingleOrArray, transform2Array } from '@/utils';
import { Store } from './index';

type SelectHandler<T = void> = (state: ComponentId[], payload: T, s: Store) => ComponentId[];

const add: SelectHandler<SingleOrArray<ComponentData>> = (state, payload) => {
  return transform2Array(payload).map(v => v.id);
};

const selectSingle: SelectHandler<ComponentId> = (state, payload) => {
  // 如果选择的组件已经选中了,就不变, 否则就换成新的组件
  if (state.indexOf(payload) !== -1) {
    return state;
  }
  return [payload];
};

const selectMultiple: SelectHandler<ComponentId> = (state, payload) => {
  if (state.indexOf(payload) !== -1) {
    return state;
  }
  return [...state, payload];
};

const selectClear: SelectHandler = () => {
  return [];
};

const selectArea: SelectHandler<ShapeData> = (state, payload, store) => {
  const { left, top, width, height } = payload;
  return store.data.present
    .filter(v => {
      const { left: l, top: t, width: w, height: h } = v;
      return left <= l && top <= t && left + width >= l + w && top + height >= t + h;
    })
    .map(v => v.id);
};

const selectAll: SelectHandler = (state, payload, store) => {
  return store.data.present.map(v => v.id);
};

const handlers = { add, selectSingle, selectMultiple, selectAll, selectClear, selectArea };

export const { reducer, actions } = createReducerWithActions(handlers);
