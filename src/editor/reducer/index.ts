import undoable, { ActionCreators } from 'redux-undo';
import type { Store } from 'src/editor/type';
import {
  combineReducers,
  createActions,
  createReducer,
  shallowArrayEqualEnhancer,
} from './reducerHelpers';
import * as dataHandlers from './data';
import * as selectedHandlers from './selected';
import * as clipboardHandlers from './clipboard';
import * as scaleHandlers from './scale';
import * as globalCrossHandlers from './globalCross';

export const actions = {
  ...ActionCreators,
  ...createActions(dataHandlers),
  ...createActions(selectedHandlers),
  ...createActions(scaleHandlers),
  ...createActions(clipboardHandlers),
};
// ActionCreators 推断有prototype
export type Actions = Omit<typeof actions, 'prototype'>;

const combinedReducer = combineReducers<Store>({
  data: undoable(createReducer(dataHandlers), {
    limit: 10,
    filter: (action) => {
      // 以WithoutHistory结尾的type 不记录历史
      return !/WithoutHistory$/.test(action.type);
    },
  }),
  selected: shallowArrayEqualEnhancer(createReducer(selectedHandlers)),
  clipboard: createReducer(clipboardHandlers),
  scale: createReducer(scaleHandlers),
});

export const reducer = (state: Store, action: any) => {
  const intermediateState = combinedReducer(state, action);
  const finalState = createReducer(globalCrossHandlers)(intermediateState, action);

  return finalState;
};
