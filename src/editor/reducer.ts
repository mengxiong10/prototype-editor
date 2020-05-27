import { createReducerWithActions, combineReducers, arrayEnhancer } from './reducerHelper';
import { ComponentData, ComponentId, ComponentRect } from '@/types/editor';
import { ShapeData } from '@/components/DrawShape';
import { randomId } from '@/utils/randomId';
import { getComponent } from './registerComponents';

export interface Store {
  data: ComponentData[];
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
    clipboard.data = data.filter(v => selected.indexOf(v.id) !== -1);
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
    const { id } = payload;
    const ids = id ? transform2Array(id) : store.selected;
    return state.map(v => {
      if (ids.indexOf(v.id) !== -1) {
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

  return { add, del, update, sort, copy, cut };
};

const getSelectHandlers = () => {
  type SelectHandler<T = void> = (state: ComponentId[], payload: T, s: Store) => ComponentId[];

  const add: SelectHandler<SingleOrArray<ComponentData>> = (state, payload) => {
    return Array.isArray(payload) ? payload.map(v => v.id) : [payload.id];
  };

  const select: SelectHandler<ComponentId> = (state, payload) => {
    // 如果选择的组件已经选中了,就不变, 否则就换成新的组件
    if (state.indexOf(payload) !== -1) {
      return state;
    }
    return [payload];
  };

  const multipleSelect: SelectHandler<ComponentId> = (state, payload) => {
    if (state.indexOf(payload) !== -1) {
      return state;
    }
    return [...state, payload];
  };

  const selectClear: SelectHandler = state => {
    return state.length === 0 ? state : [];
  };

  const selectArea: SelectHandler<ShapeData> = (state, payload, store) => {
    const { left, top, width, height } = payload;
    return store.data
      .filter(v => {
        const { left: l, top: t, width: w, height: h } = v.rect;
        return left <= l && top <= t && left + width >= l + w && top + height >= t + h;
      })
      .map(v => v.id);
  };

  const selectAll: SelectHandler = (state, payload, store) => {
    return store.data.map(v => v.id);
  };

  return { add, select, multipleSelect, selectAll, selectClear, selectArea };
};

const dataRA = createReducerWithActions(getDataHandlers());
const selectedRA = createReducerWithActions(getSelectHandlers());

export const actions = { ...selectedRA.actions, ...dataRA.actions };

export const reducer = combineReducers({
  data: dataRA.reducer,
  selected: arrayEnhancer(selectedRA.reducer),
});
