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
type ReturnPayload<T> = T extends (state: any, payload: infer P) => any ? P : void;

// 推到actions的类型
type ReturnAction<H> = {
  [key in keyof H]: (
    payload: ReturnPayload<H[key]>
  ) => { type: key; payload: ReturnPayload<H[key]> };
};

type Handler = { [key: string]: (...args: any[]) => any };

export function createActions<T extends Handler>(handlers: T, prefix?: string): ReturnAction<T> {
  const actions: any = {};
  Object.keys(handlers).forEach(key => {
    actions[key] = (payload: any) => ({ type: key, payload, prefix });
  });

  return actions;
}

export function createReducer<T extends Handler>(handlers: T, prefix?: string) {
  type S = ReturnState<T[keyof T]>;
  return (state: S, action: any): S => {
    if (action.prefix === prefix && handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action.payload);
    }
    return state;
  };
}

export function createReducerWithActions<T extends Handler>(handlers: T, prefix?: string) {
  return { actions: createActions(handlers, prefix), reducer: createReducer(handlers, prefix) };
}
