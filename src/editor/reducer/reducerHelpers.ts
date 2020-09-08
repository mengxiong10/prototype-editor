import shallowEqual from 'shallowequal';
import { shadowEqualArray } from 'src/utils/shadowEqualArray';
/**
 * *************
 * handlers 负责处理集体逻辑, 属性名就是type, 方法就是 处理函数
 * const handlers = {
 *   todo: (state, payload) => state
 * }
 * 用一个函数自动返回带类型的actions
 * const actions = createActions(handlers);
 * action 返回值是这样:
 * {
 *   todo: (payload) => { type: 'todo', payload }
 * }
 * 调用方法
 * dispatch(actions.todo(payload))
 */

// 根据handlers获取state
type ReturnState<T> = T extends (state: infer P, ...args: any[]) => any ? P : void;

// 获取payload的类型
type ReturnPayload<T> = T extends (state: any, payload: infer P, ...args: any[]) => any ? P : void;

// 推到actions的类型
type ReturnAction<H> = {
  [key in keyof H]: (
    payload: ReturnPayload<H[key]>
  ) => { type: key; payload: ReturnPayload<H[key]> };
};

type ReturnReducer<S = any, A = any> = (state: S, action: A, ...args: any[]) => S;

type ReducersMapObject<S = any> = {
  [K in keyof S]: ReturnReducer<S[K]>;
};

export type ReducerHandler<S = any, P = any, Store = any> = (
  state: S,
  payload: P,
  Store?: Store
) => S;

type ReducerHandlers = { [key: string]: ReducerHandler };

export function createActions<T extends ReducerHandlers>(handlers: T): ReturnAction<T> {
  const actions: any = {};
  Object.keys(handlers).forEach((key) => {
    actions[key] = (payload: any) => ({ type: key, payload });
  });

  return actions;
}

export function createReducer<T extends ReducerHandlers>(handlers: T) {
  type S = ReturnState<T[keyof T]>;
  return (state: S, action: any, ...args: any[]): S => {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action.payload, ...args);
    }
    return state;
  };
}

export function combineReducers<S extends { [k: string]: any }>(reducers: ReducersMapObject<S>) {
  return (state: S, action: any) => {
    const nextState: S = {} as any;
    Object.keys(reducers).forEach((k: keyof S) => {
      nextState[k] = reducers[k](state[k], action, state);
    });
    if (shallowEqual(nextState, state)) {
      return state;
    }

    return nextState;
  };
}

export function shallowArrayEqualEnhancer(reducer: ReturnReducer): ReturnReducer {
  return (state, ...args) => {
    const nextState = reducer(state, ...args);
    if (shadowEqualArray(nextState, state)) {
      return state;
    }
    return nextState;
  };
}
