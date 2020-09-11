/**
 * 处理那些影响过data的action需要同时修改selected
 */
import type { Store } from 'src/editor/type';
import type { ReducerHandler } from './reducerHelpers';

// 选中新增的id, 如果之后payload可以为数组, 相应修改长度
export const add: ReducerHandler<Store> = (state) => {
  const selected = state.data.present.slice(-1).map((v) => v.id);

  return { ...state, selected };
};

export const paste: ReducerHandler<Store> = (state) => {
  if (state.clipboard.length === 0) {
    return state;
  }
  const selected = state.data.present.slice(-state.clipboard.length).map((v) => v.id);

  return { ...state, selected };
};
