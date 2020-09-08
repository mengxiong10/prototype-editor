import React, { useRef } from 'react';
import type { ContextMenuOption } from 'src/components/ContextMenu';
import { useEditor } from './Context';
import type { Store } from './reducer/type';

export function useContextmenu({
  selected,
  clipboard,
}: Pick<Store, 'data' | 'selected' | 'clipboard'>) {
  const execCommand = useEditor();

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
        handler: () => execCommand('del'),
      },
      { type: 'Divider', key: 'd1' },
      {
        title: '剪切',
        shortcut: 'Ctrl+X',
        key: 'cut',
        handler: () => execCommand('cut'),
      },
      {
        title: '复制',
        shortcut: 'Ctrl+C',
        key: 'copy',
        handler: () => execCommand('copy'),
      },
      {
        type: 'Divider',
        key: 'd2',
      },
      {
        title: '置顶',
        key: 'top',
        shortcut: 'Ctrl+Shift+↑',
        handler: () => execCommand('sortToTop'),
      },
      {
        title: '置底',
        key: 'bottom',
        shortcut: 'Ctrl+Shift+↓',
        handler: () => execCommand('sortToBottom'),
      },
    ];

    const stageContextMenu: ContextMenuOption[] = [
      {
        title: '粘贴',
        shortcut: 'Ctrl+V',
        disabled: clipboard.length === 0,
        key: 'paste',
        handler: () => execCommand('paste', position.current),
      },
    ];

    return selected.length ? componentContextMenu : stageContextMenu;
  };

  return { getMenu, onOpen };
}
