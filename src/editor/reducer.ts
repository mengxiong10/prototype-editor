import { createReducerWithActions, combineReducers } from './reducerHelper';
import { ComponentData, ComponentId, ComponentPosition } from '@/types/editor';
import { RectData } from '@/components/DrawRect';
import { randomId } from '@/utils/randomId';
import { getComponent } from './registerComponents';

export interface Store {
  data: ComponentData[];
  selected: ComponentId[];
}

type UpdateFn<T> = ((v: T) => T) | T;

type SingleOrArray<T> = T | T[];

const updateWithFn = <T>(value: T, updater: UpdateFn<T>) => {
  return typeof updater === 'function' ? (updater as (v: T) => T)(value) : updater;
};

const transform2Array = (id: SingleOrArray<ComponentId>) => (Array.isArray(id) ? id : [id]);

export const createComponentData = (type: string, left: number, top: number): ComponentData => {
  const component = getComponent(type);
  const id = randomId();
  const { width, height } = component.defaultSize || { width: 200, height: 200 };
  const position = { top, left, width, height };
  return { id, type, position, data: {} };
};

export const cloneComponentData = (
  base: ComponentData,
  position: Partial<ComponentPosition>
): ComponentData => {
  const id = randomId();
  return {
    id,
    type: base.type,
    position: { ...base.position, ...position },
    data: JSON.parse(JSON.stringify(base.data)),
  };
};

let clipboardData: ComponentData[];

export const pasteComponentData = ({ x, y }: { x: number; y: number }) => {
  if (!clipboardData) return [];
  const minX = Math.min(...clipboardData.map(v => v.position.left));
  const minY = Math.min(...clipboardData.map(v => v.position.top));
  const diffX = x - minX;
  const diffY = y - minY;
  return clipboardData.map(v => {
    const position = { left: v.position.left + diffX, top: v.position.top + diffY };
    return cloneComponentData(v, position);
  });
};

const getDataHandlers = () => {
  type DataHandler<T = void> = (state: ComponentData[], payload: T, s: Store) => ComponentData[];

  const add: DataHandler<SingleOrArray<ComponentData>> = (state, payload) => {
    return state.concat(payload);
  };

  const del: DataHandler<SingleOrArray<ComponentId> | void> = (state, payload, store) => {
    const id = payload ? transform2Array(payload) : store.selected;
    return state.filter(v => id.indexOf(v.id) === -1);
  };

  const copy: DataHandler = (state, payload, { data, selected }) => {
    clipboardData = data.filter(v => selected.indexOf(v.id) !== -1);
    return state;
  };

  const cut: DataHandler = (...rest) => {
    copy(...rest);
    return del(...rest);
  };

  const update: DataHandler<{
    id?: SingleOrArray<ComponentId>;
    position?: { [k in keyof ComponentPosition]?: UpdateFn<number> };
    data?: any;
  }> = (state, payload, store) => {
    const { id } = payload;
    const ids = id ? transform2Array(id) : store.selected;
    return state.map(v => {
      if (ids.indexOf(v.id) !== -1) {
        const nextData = { ...v };
        ['position', 'data'].forEach((key: 'position' | 'data') => {
          if (payload[key]) {
            const nextValue = { ...nextData[key] };
            Object.keys(payload[key]).forEach(k => {
              nextValue[k] = updateWithFn(nextValue[k], payload[key][k]!);
            });
            nextData[key] = nextValue;
          }
        });
        return nextData;
      }
      return v;
    });
  };

  const sort: DataHandler<{ id: ComponentId; value: UpdateFn<number> }> = (state, payload) => {
    const { id, value } = payload;
    const index = state.findIndex(v => v.id === id);
    if (index === -1) return state;
    let nextIndex = updateWithFn(index, value);
    if (nextIndex < 0) {
      nextIndex = state.length + nextIndex;
    }
    if (nextIndex === index || nextIndex < 0 || nextIndex > state.length) {
      return state;
    }
    const nextState = state.slice();
    nextState.splice(nextIndex, 0, nextState.splice(index, 1)[0]);
    return nextState;
  };

  return { add, del, update, sort, copy, cut };
};

const getSelectHandlers = () => {
  type SelectHandler<T = void> = (state: ComponentId[], payload: T, s: Store) => ComponentId[];

  const add: SelectHandler<SingleOrArray<ComponentData>> = (state, payload) => {
    return Array.isArray(payload) ? payload.map(v => v.id) : [payload.id];
  };

  const select: SelectHandler<ComponentId> = (state, payload) => {
    // 如果选择的组件已经选中了,就不变, 否则就换成新的组件
    if (state.indexOf(payload) !== -1) {
      return state;
    }
    return [payload];
  };

  const selectClear: SelectHandler = state => {
    return state.length === 0 ? state : [];
  };

  const selectArea: SelectHandler<RectData> = (state, payload, store) => {
    const { left, top, width, height } = payload;
    const right = left + width;
    const bottom = top + height;
    return store.data
      .filter(v => {
        const { left: l, top: t, width: w, height: h } = v.position;
        return left <= l + w && right >= l && top <= t + h && bottom >= t;
      })
      .map(v => v.id);
  };

  const selectAll: SelectHandler = (state, payload, store) => {
    return store.data.map(v => v.id);
  };

  return { add, select, selectAll, selectClear, selectArea };
};

const dataRA = createReducerWithActions(getDataHandlers());
const selectedRA = createReducerWithActions(getSelectHandlers());

export const actions = { ...selectedRA.actions, ...dataRA.actions };
export const reducer = combineReducers({
  data: dataRA.reducer,
  selected: selectedRA.reducer,
});
