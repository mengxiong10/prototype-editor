import undoable, { StateWithHistory } from 'redux-undo';
import {
  createReducerWithActions,
  combineReducers,
  shallowArrayEqualEnhancer,
} from './reducerHelper';
import { ComponentData, ComponentId, ComponentRect } from '@/types/editor';
import { ShapeData } from '@/components/DrawShape';
import { randomId } from '@/utils/randomId';
import { getComponent } from './registerComponents';

export interface Store {
  data: StateWithHistory<ComponentData[]>;
  selected: ComponentId[];
}

type UpdateFn<T> = ((v: T) => T) | T;

type SingleOrArray<T> = T | T[];

const updateWithFn = <T>(value: T, updater: UpdateFn<T>) => {
  return typeof updater === 'function' ? (updater as (v: T) => T)(value) : updater;
};

const transform2Array = (id: SingleOrArray<ComponentId>) => (Array.isArray(id) ? id : [id]);

export const createComponentData = (
  type: string,
  rect: Partial<ComponentRect>,
  association?: ComponentId
): ComponentData => {
  const { defaultSize } = getComponent(type);
  const id = randomId();
  const defaultRect = { left: 10, top: 10, width: 200, height: 100 };

  return { id, type, rect: { ...defaultRect, ...defaultSize, ...rect }, data: {}, association };
};

export const cloneComponentData = (
  base: ComponentData,
  rect: Partial<ComponentRect>
): ComponentData => {
  const id = randomId();
  return {
    id,
    type: base.type,
    rect: { ...base.rect, ...rect },
    data: JSON.parse(JSON.stringify(base.data)),
  };
};

export const clipboard: {
  data: ComponentData[];
} = {
  data: [],
};

export const pasteComponentData = ({ x, y }: { x: number; y: number }) => {
  if (clipboard.data.length === 0) return [];
  const minX = Math.min(...clipboard.data.map(v => v.rect.left));
  const minY = Math.min(...clipboard.data.map(v => v.rect.top));
  const diffX = x - minX;
  const diffY = y - minY;
  return clipboard.data.map(v => {
    const position = { left: v.rect.left + diffX, top: v.rect.top + diffY };
    return cloneComponentData(v, position);
  });
};

const getDataHandlers = () => {
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

  const update: DataHandler<{
    id?: SingleOrArray<ComponentId>;
    rect?: (prev: ComponentRect) => Partial<ComponentRect> | Partial<ComponentRect>;
    data?: any;
  }> = (state, payload, store) => {
    const { id, rect, data } = payload;
    const ids = id ? transform2Array(id) : store.selected;
    // 如果是空对象就直接返回当前值,
    // 如果之前使用了updateWithouthistory, 没有记录最新值的历史, 这个可以作为把最新的值放到history里面的一个hack,
    // 适用于拖动结束 或者 输入框失焦 后
    // 当然也可以触发一个没有监听的type, 或者专门写一个语义化的type返回当前state
    if (!rect && !data) {
      return state;
    }
    return state.map(v => {
      if (ids.indexOf(v.id) !== -1) {
        // 如果有需要, 可以引入immer, 确保相同的数据直接返回原始值.
        const nextData = { ...v };
        ['rect', 'data'].forEach((key: 'rect' | 'data') => {
          if (payload[key]) {
            const nextValue = { ...nextData[key] };
            nextData[key] = { ...nextValue, ...updateWithFn(nextValue, payload[key]) };
          }
        });
        return nextData;
      }
      return v;
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

  return { add, del, update, sort, copy, cut, updateWithoutHistory: update };
};

const getSelectHandlers = () => {
  type SelectHandler<T = void> = (state: ComponentId[], payload: T, s: Store) => ComponentId[];

  const add: SelectHandler<SingleOrArray<ComponentData>> = (state, payload) => {
    return Array.isArray(payload) ? payload.map(v => v.id) : [payload.id];
  };

  const selectSingle: SelectHandler<ComponentId> = (state, payload) => {
    // 如果选择的组件已经选中了,就不变, 否则就换成新的组件
    if (state.indexOf(payload) !== -1) {
      return state;
    }
    return [payload];
  };

  const selectMultiple: SelectHandler<ComponentId> = (state, payload) => {
    if (state.indexOf(payload) !== -1) {
      return state;
    }
    return [...state, payload];
  };

  const selectClear: SelectHandler = () => {
    return [];
  };

  const selectArea: SelectHandler<ShapeData> = (state, payload, store) => {
    const { left, top, width, height } = payload;
    return store.data.present
      .filter(v => {
        const { left: l, top: t, width: w, height: h } = v.rect;
        return left <= l && top <= t && left + width >= l + w && top + height >= t + h;
      })
      .map(v => v.id);
  };

  const selectAll: SelectHandler = (state, payload, store) => {
    return store.data.present.map(v => v.id);
  };

  return { add, selectSingle, selectMultiple, selectAll, selectClear, selectArea };
};

const dataRA = createReducerWithActions(getDataHandlers());
const selectedRA = createReducerWithActions(getSelectHandlers());

export const actions = { ...selectedRA.actions, ...dataRA.actions };

export const reducer = combineReducers<Store>({
  data: undoable(dataRA.reducer, {
    limit: 10,
    filter: action => {
      // updateWithouthistory 和 update 一样, 除了不记录历史
      const whitelist = ['updateWithoutHistory'];

      return !whitelist.includes(action.type);
    },
  }),
  selected: shallowArrayEqualEnhancer(selectedRA.reducer),
});
