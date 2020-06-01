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
      // 以WithoutHistory结尾的type 不记录历史
      return !/WithoutHistory$/.test(action.type);
    },
  }),
  selected: shallowArrayEqualEnhancer(selectedReducer),
});
