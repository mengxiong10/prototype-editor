import type {
  ComponentData,
  ComponentEditableData,
  ComponentId,
  SliceReducerHandler,
} from 'src/editor/type';
import { set } from 'dot-prop-immutable';
import { cloneComponentData } from '../componentUtil';

type DataHandler<P = void> = SliceReducerHandler<ComponentData[], P>;

export const add: DataHandler<ComponentData> = (state, payload) => {
  return state.concat(payload);
};

export const del: DataHandler = (state, payload, { selected }) => {
  return state.filter((v) => selected.indexOf(v.id) === -1);
};

export const cut = del;

export const paste: DataHandler<{ x: number; y: number }> = (
  state,
  { x, y },
  { clipboard, scale }
) => {
  if (clipboard.length === 0) return state;
  const minX = Math.min(...clipboard.map((v) => v.left));
  const minY = Math.min(...clipboard.map((v) => v.top));
  const diffX = x / scale - minX;
  const diffY = y / scale - minY;
  const newData = clipboard.map((v) => {
    return cloneComponentData(v, { left: v.left + diffX, top: v.top + diffY });
  });

  return state.concat(newData);
};

type UpdatePayload =
  | Partial<ComponentEditableData>
  | ((obj: ComponentData) => Partial<ComponentEditableData>);

// 默认更新当前选中的元素
export const update: DataHandler<UpdatePayload> = (state, payload, { selected }) => {
  if (selected.length === 0) return state;
  return state.map((item) => {
    if (selected.includes(item.id)) {
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

export const updateById: DataHandler<{
  id: ComponentId;
  path: number | string | (string | number)[];
  value: any;
}> = (state, { id, path, value }) => {
  return state.map((item) => {
    if (item.id === id) {
      return set(item, path, value);
    }
    return item;
  });
};

// type 为 updateWithoutHistory 不记录历史
export const updateWithoutHistory = update;

// 该actions, 不更新数据, 只是检查当前值和上一次应该记录历史的值比较
// 如果之前使用了updateWithouthistory, 没有记录之前值的历史, 调用可以把上一次应该记录的保存进去
// https://github.com/omnidan/redux-undo/blob/b4edbb3603/src/reducer.js#L208
export const recordHistory: DataHandler = (state) => state;

// 置顶
export const sortToTop: DataHandler = (state, payload, { selected }) => {
  const left: ComponentData[] = [];
  const right: ComponentData[] = [];
  state.forEach((v) => (selected.includes(v.id) ? left.push(v) : right.push(v)));
  return right.concat(left);
};
// 置底
export const sortToBottom: DataHandler = (state, payload, { selected }) => {
  const left: ComponentData[] = [];
  const right: ComponentData[] = [];
  state.forEach((v) => (selected.includes(v.id) ? left.push(v) : right.push(v)));
  return left.concat(right);
};

// 辅助函数
const wrapperSelectedDataUpdater = (
  updater: (s: ComponentData[]) => UpdatePayload,
  min = 2
): DataHandler => {
  return (state, payload, store) => {
    const selected = store.selected;
    const selectedData = state.filter((v) => selected.includes(v.id));
    if (selectedData.length < min) {
      return state;
    }
    return update(state, updater(selectedData), store);
  };
};

// 左对齐
export const alignLeft = wrapperSelectedDataUpdater((selectedData) => {
  const left = Math.min(...selectedData.map((v) => v.left));
  return { left };
});

export const alignTop = wrapperSelectedDataUpdater((selectedData) => {
  const top = Math.min(...selectedData.map((v) => v.top));
  return { top };
});

export const alignRight = wrapperSelectedDataUpdater((selectedData) => {
  const right = Math.max(...selectedData.map((v) => v.left + v.width));
  return (prev) => ({ left: right - prev.width });
});

export const alignBottom = wrapperSelectedDataUpdater((selectedData) => {
  const bottom = Math.max(...selectedData.map((v) => v.top + v.height));
  return (prev) => ({ top: bottom - prev.height });
});

export const alignHorizontal = wrapperSelectedDataUpdater((selectedData) => {
  const left = Math.min(...selectedData.map((v) => v.left));
  const right = Math.max(...selectedData.map((v) => v.left + v.width));
  return (prev) => ({ left: (right + left) / 2 - prev.width / 2 });
});

export const alignVertical = wrapperSelectedDataUpdater((selectedData) => {
  const top = Math.min(...selectedData.map((v) => v.top));
  const bottom = Math.max(...selectedData.map((v) => v.top + v.height));
  return (prev) => ({ top: (bottom + top) / 2 - prev.height / 2 });
});

// 等间距排列
export const spaceHorizontal = wrapperSelectedDataUpdater((selectedData) => {
  const data = selectedData.slice().sort((a, b) => a.left - b.left);
  const totalWidth = data.reduce((prev, cur) => prev + cur.width, 0);
  const rectWidth = Math.max(...data.map((v) => v.left + v.width)) - data[0].left;
  const gap = (rectWidth - totalWidth) / (data.length - 1);
  let left = data[0].left;
  const map: Record<string, { left: number }> = {};
  data.forEach((v) => {
    map[v.id] = { left };
    left = left + v.width + gap;
  });
  return (prev) => map[prev.id];
}, 3);

export const spaceVertical = wrapperSelectedDataUpdater((selectedData) => {
  const data = selectedData.slice().sort((a, b) => a.top - b.top);
  const totalHeight = data.reduce((prev, cur) => prev + cur.height, 0);
  const rectHeight = Math.max(...data.map((v) => v.top + v.height)) - data[0].top;
  const gap = (rectHeight - totalHeight) / (data.length - 1);
  let top = data[0].top;
  const map: Record<string, { top: number }> = {};
  data.forEach((v) => {
    map[v.id] = { top };
    top = top + v.height + gap;
  });
  return (prev) => map[prev.id];
}, 3);
