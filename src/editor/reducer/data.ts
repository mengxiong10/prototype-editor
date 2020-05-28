import { createReducerWithActions } from './reducerHelpers';
import { ComponentData, ComponentId, ComponentEditableData } from '@/types/editor';
import { SingleOrArray, transform2Array } from '@/utils';
import { clipboard } from '../componentUtil';
import { Store } from './index';

type DataHandler<T = void> = (state: ComponentData[], payload: T, s: Store) => ComponentData[];

const add: DataHandler<SingleOrArray<ComponentData>> = (state, payload) => {
  return state.concat(payload);
};

const del: DataHandler<SingleOrArray<ComponentId> | void> = (state, payload, store) => {
  const id = payload ? transform2Array(payload) : store.selected;
  return state.filter(v => id.indexOf(v.id) === -1);
};

const copy: DataHandler = (state, payload, { data, selected }) => {
  clipboard.data = data.present.filter(v => selected.indexOf(v.id) !== -1);
  return state;
};

const cut: DataHandler = (...rest) => {
  copy(...rest);
  return del(...rest);
};

const update: DataHandler<
  Partial<ComponentEditableData> | ((obj: ComponentData) => Partial<ComponentEditableData>)
> = (state, payload, store) => {
  const ids = store.selected;
  if (ids.length === 0) {
    return state;
  }
  return state.map(item => {
    if (ids.indexOf(item.id) !== -1) {
      const updater = typeof payload === 'function' ? payload(item) : payload;
      const nextItem = { ...item, ...updater };
      if (updater.data) {
        nextItem.data = { ...item.data, ...updater.data };
      }
      // 避免参数传错, 导致id 和 type 被修改
      nextItem.id = item.id;
      nextItem.type = item.type;
      return nextItem;
    }
    return item;
  });
};

const sort: DataHandler<0 | -1> = (state, payload, store) => {
  const value = payload;
  const ids = store.selected;
  const current: ComponentData[] = [];
  const rest: ComponentData[] = [];
  state.forEach(v => {
    ids.includes(v.id) ? current.push(v) : rest.push(v);
  });
  if (value === 0) {
    return current.concat(rest);
  }
  if (value === -1) {
    return rest.concat(current);
  }
  return state;
};

// 该actions, 不更新数据, 只是检查当前值和上一次应该记录历史的值比较
// 如果之前使用了updateWithouthistory, 没有记录之前值的历史, 调用可以把上一次应该记录的保存进去
// https://github.com/omnidan/redux-undo/blob/b4edbb3603/src/reducer.js#L208
const recordHistory: DataHandler = state => state;

// type 为 updateWithoutHistory 不记录历史
const updateWithoutHistory = update;

const handlers = { add, del, update, sort, copy, cut, updateWithoutHistory, recordHistory };

export const { actions, reducer } = createReducerWithActions(handlers);
