import type { ComponentData, SliceReducerHandler } from 'src/editor/type';

/**
 * 时光荏苒
 * 记忆中总有这样一些人
 * 初见便定格了一生
 * 低眉浅笑间润色了时光
 * 惊艳了岁月
 */
type ClipboardHandler<P = void> = SliceReducerHandler<ComponentData[], P>;

export const copy: ClipboardHandler = (state, payload, { data, selected }) => {
  return data.present.filter((v) => selected.indexOf(v.id) !== -1);
};

export const cut = copy;
