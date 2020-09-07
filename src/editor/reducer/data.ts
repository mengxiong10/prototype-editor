import type { ComponentData, ComponentEditableData } from 'src/types/editor';
import { createReducerWithActions } from './reducerHelpers';
import { createComponentData, cloneComponentData } from '../componentUtil';
import type { SliceReducerHandler } from './type';

type DataHandler<P = void> = SliceReducerHandler<ComponentData[], P>;

const add: DataHandler<Partial<ComponentData> & Pick<ComponentData, 'type'>> = (state, payload) => {
  return state.concat(createComponentData(payload));
};

const del: DataHandler = (state, payload, store) => {
  const id = store.selected;
  return state.filter((v) => id.indexOf(v.id) === -1);
};

const cut = del;

const paste: DataHandler<{ x: number; y: number }> = (state, { x, y }, { clipboard }) => {
  if (clipboard.length === 0) return state;
  const minX = Math.min(...clipboard.map((v) => v.left));
  const minY = Math.min(...clipboard.map((v) => v.top));
  const diffX = x - minX;
  const diffY = y - minY;
  const newData = clipboard.map((v) => {
    return cloneComponentData(v, { left: v.left + diffX, top: v.top + diffY });
  });

  return state.concat(newData);
};

type UpdatePayload =
  | Partial<ComponentEditableData>
  | ((obj: ComponentData) => Partial<ComponentEditableData>);

const update: DataHandler<UpdatePayload> = (state, payload, store) => {
  const ids = store.selected;
  if (ids.length === 0) return state;
  return state.map((item) => {
    if (ids.includes(item.id)) {
      const updater = typeof payload === 'function' ? payload(item) : payload;
      if (updater && updater !== item) {
        // data 那里使用了set, 返回是完整的obj, 不用深度的merge了
        // return mergeDeepObject(item, updater);
        return { ...item, ...updater };
      }
    }
    return item;
  });
};

// type 为 updateWithoutHistory 不记录历史
const updateWithoutHistory = update;

const sort: DataHandler<0 | -1> = (state, payload, store) => {
  const value = payload;
  const ids = store.selected;
  const current: ComponentData[] = [];
  const rest: ComponentData[] = [];
  state.forEach((v) => {
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

type AlignPayload = 'left' | 'top' | 'bottom' | 'right' | 'vertical' | 'horizontal';

// 对齐
const align: DataHandler<AlignPayload> = (state, payload, store) => {
  const ids = store.selected;
  const selectedData = state.filter((v) => ids.includes(v.id));
  if (selectedData.length < 2) {
    return state;
  }
  const updaters: { [key in AlignPayload]: () => UpdatePayload } = {
    left: () => {
      const left = Math.min(...selectedData.map((v) => v.left));
      return { left };
    },
    top: () => {
      const top = Math.min(...selectedData.map((v) => v.top));
      return { top };
    },
    right: () => {
      const right = Math.max(...selectedData.map((v) => v.left + v.width));
      return (prev) => ({ left: right - prev.width });
    },
    bottom: () => {
      const bottom = Math.max(...selectedData.map((v) => v.top + v.height));
      return (prev) => ({ top: bottom - prev.height });
    },
    horizontal: () => {
      const left = Math.min(...selectedData.map((v) => v.left));
      const right = Math.max(...selectedData.map((v) => v.left + v.width));
      return (prev) => ({ left: (right + left) / 2 - prev.width / 2 });
    },
    vertical: () => {
      const top = Math.min(...selectedData.map((v) => v.top));
      const bottom = Math.max(...selectedData.map((v) => v.top + v.height));
      return (prev) => ({ top: (bottom + top) / 2 - prev.height / 2 });
    },
  };

  return update(state, updaters[payload](), store);
};

// 等间距排列
const space: DataHandler<'vertical' | 'horizontal'> = (state, payload, store) => {
  const ids = store.selected;
  const selectedData = state.filter((v) => ids.includes(v.id));
  if (selectedData.length < 3) {
    return state;
  }
  const baseKey = payload === 'vertical' ? 'top' : 'left';
  const lengthKey = payload === 'vertical' ? 'height' : 'width';

  const curWidth =
    Math.max(...selectedData.map((v) => v[baseKey] + v[lengthKey])) -
    Math.min(...selectedData.map((v) => v[baseKey]));
  const totalWidth = selectedData.reduce((prev, curr) => prev + curr[lengthKey], 0);
  const gap = (curWidth - totalWidth) / (selectedData.length - 1);
  selectedData.sort((a, b) => a[baseKey] - b[baseKey]);

  let lastPosition = selectedData[0][baseKey] + selectedData[0][lengthKey];
  const nextData = selectedData.slice(1).map((v) => {
    const nextValue = lastPosition + gap;
    lastPosition = nextValue + v[lengthKey];
    return { id: v.id, [baseKey]: nextValue } as Pick<ComponentData, 'id' | 'left' | 'top'>;
  });

  const updater: UpdatePayload = (prev) => nextData.find((v) => prev.id === v.id)!;

  return update(state, updater, store);
};

// 该actions, 不更新数据, 只是检查当前值和上一次应该记录历史的值比较
// 如果之前使用了updateWithouthistory, 没有记录之前值的历史, 调用可以把上一次应该记录的保存进去
// https://github.com/omnidan/redux-undo/blob/b4edbb3603/src/reducer.js#L208
const recordHistory: DataHandler = (state) => state;

const handlers = {
  add,
  del,
  cut,
  paste,
  update,
  sort,
  align,
  space,
  updateWithoutHistory,
  recordHistory,
};

export const { actions, reducer } = createReducerWithActions(handlers);
