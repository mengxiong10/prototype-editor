import { createReducerWithActions, combineReducers } from './reducerHelper';
import { ComponentData, ComponentId, ComponentPosition } from '@/types/editor';
import { RectData } from '@/components/DrawRect';
import { randomId } from '@/utils/randomId';
import { getComponent } from './registerComponents';

type StateData = ComponentData[];
type StateSelected = ComponentId[];

export interface Store {
  data: StateData;
  selected: StateSelected;
}

type UpdateFn<T> = ((v: T) => T) | T;

type ArrayComponentId = ComponentId | ComponentId[];

const updateWithFn = <T>(value: T, updater: UpdateFn<T>) => {
  return typeof updater === 'function' ? (updater as (v: T) => T)(value) : updater;
};

const transform2Array = (id: ArrayComponentId) => (Array.isArray(id) ? id : [id]);

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

// 处理 data 逻辑
const componentDataHandlers = {
  add(state: StateData, payload: ComponentData | ComponentData[]): StateData {
    return state.concat(payload);
  },
  del(state: StateData, payload: ArrayComponentId | void, store: Store): StateData {
    const id = payload ? transform2Array(payload) : store.selected;
    return state.filter(v => id.indexOf(v.id) === -1);
  },
  update(
    state: StateData,
    payload: {
      id?: ArrayComponentId;
      position?: { [k in keyof ComponentPosition]?: UpdateFn<number> };
      data?: any;
    },
    store: Store
  ): StateData {
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
  },
  sort(state: StateData, payload: { id: ComponentId; value: UpdateFn<number> }): StateData {
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
  },
};

// 处理selected逻辑
const selectedHandler = {
  // 添加组件后,选中该组件
  add(state: StateSelected, payload: ComponentData | ComponentData[]): StateSelected {
    return Array.isArray(payload) ? payload.map(v => v.id) : [payload.id];
  },
  select(state: StateSelected, payload: ComponentId): StateSelected {
    // 如果选择的组件已经选中了,就不变, 否则就换成新的组件
    if (state.indexOf(payload) !== -1) {
      return state;
    }
    return [payload];
  },
  selectClear(state: StateSelected): StateSelected {
    return state.length === 0 ? state : [];
  },
  selectArea(state: StateSelected, payload: RectData, store: Store): StateSelected {
    const { left, top, width, height } = payload;
    const right = left + width;
    const bottom = top + height;
    return store.data
      .filter(v => {
        const { left: l, top: t, width: w, height: h } = v.position;
        return left <= l + w && right >= l && top <= t + h && bottom >= t;
      })
      .map(v => v.id);
  },
  selectAll(state: StateSelected, payload: void, store: Store): StateSelected {
    return store.data.map(v => v.id);
  },
};

const dataRA = createReducerWithActions(componentDataHandlers);
const selectedRA = createReducerWithActions(selectedHandler);

export const actions = { ...selectedRA.actions, ...dataRA.actions };
export const reducer = combineReducers({
  data: dataRA.reducer,
  selected: selectedRA.reducer,
});
