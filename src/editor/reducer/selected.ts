import { castArray } from 'lodash';
import type { ComponentId, SliceReducerHandler } from 'src/editor/type';
import type { ShapeData } from 'src/components/DrawShape';

type SelectHandler<P = void> = SliceReducerHandler<ComponentId[], P>;

export const select: SelectHandler<ComponentId | ComponentId[]> = (state, payload) => {
  return castArray(payload);
};

export const selectAppend: SelectHandler<ComponentId | ComponentId[]> = (state, payload) => {
  return state.concat(payload);
};

export const selectArea: SelectHandler<ShapeData> = (state, payload, store) => {
  const { left, top, width, height } = payload;
  return store.data.present
    .filter((v) => {
      const { left: l, top: t, width: w, height: h } = v;
      return left <= l && top <= t && left + width >= l + w && top + height >= t + h;
    })
    .map((v) => v.id);
};

export const selectAll: SelectHandler = (state, payload, store) => {
  return store.data.present.map((v) => v.id);
};

// TODO: redo, undo的时候也可能添加和删除item, 导致selected的id无效
export const del: SelectHandler = () => {
  return [];
};
