import type { StateWithHistory } from 'redux-undo';
import type { ComponentData, ComponentId } from 'src/types/editor';

export interface Store {
  scale: number;
  data: StateWithHistory<ComponentData[]>;
  selected: ComponentId[];
  clipboard: ComponentData[];
}

export type SliceReducerHandler<S, P> = (state: S, payload: P, Store: Store) => S;
