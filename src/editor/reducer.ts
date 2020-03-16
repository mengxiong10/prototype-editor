import shallowEqual from 'shallowequal';
import { createReducerWithActions } from './reducerHelper';
import { ComponentData, ComponentId, ComponentPosition } from '@/types/editor';

type StateDate = ComponentData[];
type StateSelected = ComponentId[];
type Store = {
  data: StateDate;
  selected: StateSelected;
};

type ArrayComponentId = ComponentId | ComponentId[];

const transform2Array = (id: ArrayComponentId) => (Array.isArray(id) ? id : [id]);

// 处理 data 逻辑
const componentDataHandlers = {
  add(state: StateDate, payload: ComponentData): StateDate {
    return [...state, payload];
  },
  del(state: StateDate, payload: { id: ArrayComponentId } | undefined, store: Store): StateDate {
    const id = payload ? transform2Array(payload.id) : store.selected;
    return state.filter(v => id.indexOf(v.id) === -1);
  },
  update(
    state: StateDate,
    payload: { id?: ArrayComponentId; data?: any; position?: ComponentPosition },
    store: Store
  ): StateDate {
    const id = payload.id ? transform2Array(payload.id) : store.selected;
    const { data, position } = payload;
    return state.map(v => {
      if (id.indexOf(v.id) !== -1) {
        return {
          ...v,
          data: data ? { ...v.data, ...data } : v.data,
          position: position ? { ...v.position, ...position } : v.position,
        };
      }
      return v;
    });
  },
  sort(
    state: StateDate,
    payload: { id: ComponentId; value: number | ((i: number) => number) }
  ): StateDate {
    const { id, value } = payload;
    const index = state.findIndex(v => v.id === id);
    if (index === -1) return state;
    let nextIndex = typeof value === 'function' ? value(index) : value;
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
  add(state: StateSelected, payload: ComponentData): StateSelected {
    return [payload.id];
  },
  select(state: StateSelected, payload: ArrayComponentId): StateSelected {
    const id = transform2Array(payload);
    if (id.length === state.length && id.every((v, i) => v === state[i])) {
      return state;
    }
    return id;
  },
};

const { actions: dataActions, reducer: dataReducer } = createReducerWithActions(
  componentDataHandlers
);

const { actions: selectedAction, reducer: selectedReducer } = createReducerWithActions(
  selectedHandler
);

// 合并 actions
export const actions = { ...selectedAction, ...dataActions };

// 合并reducer
export const reducer = (state: Store, action: any) => {
  const nextState = {
    data: dataReducer(state.data, action, state),
    selected: selectedReducer(state.selected, action, state),
  };
  if (shallowEqual(nextState, state)) {
    return state;
  }

  return nextState;
};
