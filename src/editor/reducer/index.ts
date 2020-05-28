import undoable, { StateWithHistory } from 'redux-undo';
import { combineReducers, shallowArrayEqualEnhancer } from './reducerHelpers';
import { ComponentData, ComponentId } from '@/types/editor';
import { actions as dataActions, reducer as dataReducer } from './data';
import { actions as selectedActions, reducer as selectedReducer } from './selected';

export interface Store {
  data: StateWithHistory<ComponentData[]>;
  selected: ComponentId[];
}

export const actions = { ...dataActions, ...selectedActions };

export const reducer = combineReducers<Store>({
  data: undoable(dataReducer, {
    limit: 10,
    filter: action => {
      // updateWithouthistory 和 update 一样, 除了不记录历史
      const whitelist = ['updateWithoutHistory'];

      return !whitelist.includes(action.type);
    },
  }),
  selected: shallowArrayEqualEnhancer(selectedReducer),
});
