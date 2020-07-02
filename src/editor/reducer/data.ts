import _ from 'lodash';
import omit from 'object.omit';
import type { ComponentData, ComponentId, ComponentEditableData } from 'src/types/editor';
import { mergeDeepObject } from 'src/utils/object';
import { createReducerWithActions } from './reducerHelpers';
import { clipboard } from '../componentUtil';
import type { Store } from './index';

export type ComponentDataById = {[key: string]: ComponentData };

type DataHandler<T = void> = (state: ComponentDataById, payload: T, s: Store) => ComponentDataById;


const add: DataHandler<ComponentData | ComponentData[]> = (state, payload) => {
  const maxZIndexItem = _.maxBy(Object.keys(state).map(id => state[id]), (o) => o.zIndex);
  let maxZIndex = maxZIndexItem ? maxZIndexItem.zIndex : 10;

  const arr = _.castArray(payload).map(v => {
    if (!v.zIndex) v.zIndex = ++maxZIndex
    return { [v.id]: v }
  })

  return Object.assign({}, state, ...arr);
};

const del: DataHandler<ComponentId | ComponentId[] | void> = (state, payload, { selected }) => {
  return omit(state, payload || selected);
};

const copy: DataHandler = (state, payload, { selected }) => {
  clipboard.data = selected.map(id => state[id]);
  return state;
};

const cut: DataHandler = (...rest) => {
  copy(...rest);
  return del(...rest);
};

type UpdatePayload =
  | Partial<ComponentEditableData>
  | ((obj: ComponentData) => Partial<ComponentEditableData>);

const update: DataHandler<UpdatePayload> = (state, payload, { selected }) => {
  const updaters = selected.filter(id => state[id]).map(id => {
    return {[id]: typeof payload === 'function' ? payload(state[id]) : payload }
  });
  return mergeDeepObject(state, ...updaters);
};

const toTop: DataHandler = (state, payload, store) => {
  const { selected } = store;
  const maxZIndexItem = _.maxBy(_.without(Object.keys(state), ...selected).map(id => state[id]), (o) => o.zIndex);
  let maxZIndex = maxZIndexItem ? maxZIndexItem.zIndex : 10;

  selected.map(id => state[id]).sort((a, b) => a.zIndex - b.zIndex).map(v => ({[v.id]: ++maxZIndex}))

  const updater: UpdatePayload = () => {
    return { zIndex: ++maxZIndex }
  }

  return update(state, updater, store);
}

// 0 置顶 -1 置底
const sort: DataHandler<0 | -1> = (state, payload, { selected }) => {


  // const value = payload;
  // const ids = store.selected;
  // const current: ComponentData[] = [];
  // const rest: ComponentData[] = [];
  // state.forEach(v => {
  //   ids.includes(v.id) ? current.push(v) : rest.push(v);
  // });
  // if (value === 0) {
  //   return current.concat(rest);
  // }
  // if (value === -1) {
  //   return rest.concat(current);
  // }
  return state;
};

type AlignPayload = 'left' | 'top' | 'bottom' | 'right' | 'vertical' | 'horizontal';

// 对齐
const align: DataHandler<AlignPayload> = (state, payload, store) => {
  const selectedData = store.selected.map(id => state[id]);
  if (selectedData.length < 2) {
    return state;
  }
  const updaters: { [key in AlignPayload]: () => UpdatePayload } = {
    left: () => {
      const left = Math.min(...selectedData.map(v => v.left));
      return { left };
    },
    top: () => {
      const top = Math.min(...selectedData.map(v => v.top));
      return { top };
    },
    right: () => {
      const right = Math.max(...selectedData.map(v => v.left + v.width));
      return prev => ({ left: right - prev.width });
    },
    bottom: () => {
      const bottom = Math.max(...selectedData.map(v => v.top + v.height));
      return prev => ({ top: bottom - prev.height });
    },
    horizontal: () => {
      const left = Math.min(...selectedData.map(v => v.left));
      const right = Math.max(...selectedData.map(v => v.left + v.width));
      return prev => ({ left: (right + left) / 2 - prev.width / 2 });
    },
    vertical: () => {
      const top = Math.min(...selectedData.map(v => v.top));
      const bottom = Math.max(...selectedData.map(v => v.top + v.height));
      return prev => ({ top: (bottom + top) / 2 - prev.height / 2 });
    },
  };

  return update(state, updaters[payload](), store);
};

// 等间距排列
const space: DataHandler<'vertical' | 'horizontal'> = (state, payload, store) => {
  const selectedData = store.selected.map(id => state[id]);
  if (selectedData.length < 3) {
    return state;
  }
  const baseKey = payload === 'vertical' ? 'top' : 'left';
  const lengthKey = payload === 'vertical' ? 'height' : 'width';

  const curWidth =
    Math.max(...selectedData.map(v => v[baseKey] + v[lengthKey])) -
    Math.min(...selectedData.map(v => v[baseKey]));
  const totalWidth = selectedData.reduce((prev, curr) => prev + curr[lengthKey], 0);
  const gap = (curWidth - totalWidth) / (selectedData.length - 1);
  selectedData.sort((a, b) => a[baseKey] - b[baseKey]);

  let lastPosition = selectedData[0][baseKey] + selectedData[0][lengthKey];
  const nextData = selectedData.slice(1).map(v => {
    const nextValue = lastPosition + gap;
    lastPosition = nextValue + v[lengthKey];
    return { id: v.id, [baseKey]: nextValue } as Pick<ComponentData, 'id' | 'left' | 'top'>;
  });

  const updater: UpdatePayload = prev => nextData.find(v => prev.id === v.id)!;

  return update(state, updater, store);
};

// 该actions, 不更新数据, 只是检查当前值和上一次应该记录历史的值比较
// 如果之前使用了updateWithouthistory, 没有记录之前值的历史, 调用可以把上一次应该记录的保存进去
// https://github.com/omnidan/redux-undo/blob/b4edbb3603/src/reducer.js#L208
const recordHistory: DataHandler = state => state;

// type 为 updateWithoutHistory 不记录历史
const updateWithoutHistory = update;

const handlers = {
  add,
  del,
  update,
  sort,
  copy,
  cut,
  align,
  space,
  updateWithoutHistory,
  recordHistory,
};

export const { actions, reducer } = createReducerWithActions(handlers);
