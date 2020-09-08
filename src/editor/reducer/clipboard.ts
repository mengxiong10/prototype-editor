import type { ComponentData } from 'src/types/editor';
import type { SliceReducerHandler } from './type';

type ClipboardHandler<P = void> = SliceReducerHandler<ComponentData[], P>;

export const copy: ClipboardHandler = (state, payload, { data, selected }) => {
  return data.present.filter((v) => selected.indexOf(v.id) !== -1);
};

export const cut = copy;
