import { createReducerWithActions } from './reducerHelper';
import { ComponentData, ComponentId, ComponentPosition } from '@/types/editor';

type S = Readonly<ComponentData[]>;
type ArrayCid = ComponentId | ComponentId[];

const componentDataHandlers = {
  add(state: S, payload: ComponentData): S {
    return [...state, payload];
  },
  del(state: S, payload: { id: ArrayCid }): S {
    const id = Array.isArray(payload.id) ? payload.id : [payload.id];
    return state.filter(v => id.indexOf(v.id) === -1);
  },
  update(state: S, payload: { id: ArrayCid; data?: any; position?: ComponentPosition }): S {
    const id = Array.isArray(payload.id) ? payload.id : [payload.id];
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
  sort(state: S, payload: { id: ComponentId; value: number | ((i: number) => number) }): S {
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

export const { actions, reducer } = createReducerWithActions(componentDataHandlers);
