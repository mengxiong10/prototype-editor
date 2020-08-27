import undoable, { ActionCreators } from 'redux-undo';
import { combineReducers, shallowArrayEqualEnhancer } from './reducerHelpers';
import { actions as dataActions, reducer as dataReducer } from './data';
import { actions as selectedActions, reducer as selectedReducer } from './selected';
import { actions as clipboardActions, reducer as clipboardReducer } from './clipboard';
import { reducer as globalCross } from './globalCross';
import type { Store } from './type';

export const actions = {
  ...ActionCreators,
  ...dataActions,
  ...selectedActions,
  ...clipboardActions,
};

const combinedReducer = combineReducers<Store>({
  data: undoable(dataReducer, {
    limit: 10,
    filter: (action) => {
      // 以WithoutHistory结尾的type 不记录历史
      return !/WithoutHistory$/.test(action.type);
    },
  }),
  selected: shallowArrayEqualEnhancer(selectedReducer),
  clipboard: clipboardReducer,
});

export const reducer = (state: Store, action: any) => {
  const intermediateState = combinedReducer(state, action);
  const finalState = globalCross(intermediateState, action);

  return finalState;
};
