import React, { useRef } from 'react';
import { ContextMenuOption } from '@/components/ContextMenu';
import { useEditor } from './Context';
import { actions, pasteComponentData, Store, clipboard } from './reducer';

export function useContextmenu({ selected }: Store) {
  const dispatch = useEditor();

  const position = useRef({ x: 0, y: 0 });

  const onOpen = (evt: React.MouseEvent) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    position.current.x = evt.clientX - rect.left;
    position.current.y = evt.clientY - rect.top;
  };

  const getMenu = () => {
    const componentContextMenu: ContextMenuOption[] = [
      {
        title: '删除',
        shortcut: 'Del',
        key: 'del',
        handler: () => dispatch(actions.del()),
      },
      { type: 'Divider' },
      {
        title: '剪切',
        shortcut: 'Ctrl+X',
        key: 'cut',
        handler: () => dispatch(actions.cut()),
      },
      {
        title: '复制',
        shortcut: 'Ctrl+C',
        key: 'copy',
        handler: () => dispatch(actions.copy()),
      },
      {
        type: 'Divider',
      },
      {
        title: '置顶',
        key: 'top',
        shortcut: 'Shift+Ctrl+↑',
        handler: () => dispatch(actions.sort(-1)),
      },
      {
        title: '置底',
        key: 'bottom',
        shortcut: 'Shift+Ctrl+↓',
        handler: () => dispatch(actions.sort(0)),
      },
    ];

    const stageContextMenu: ContextMenuOption[] = [
      {
        title: '粘贴',
        shortcut: 'Ctrl+V',
        disabled: clipboard.data.length === 0,
        key: 'paste',
        handler: () => dispatch(actions.add(pasteComponentData(position.current))),
      },
    ];

    return selected.length ? componentContextMenu : stageContextMenu;
  };

  return { getMenu, onOpen };
}
