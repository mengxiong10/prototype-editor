import type { Store } from 'src/editor/type';
import React, { useRef } from 'react';
import type { ContextMenuOption } from 'src/components/ContextMenu';
import ContextMenuTrigger from 'src/components/ContextMenuTrigger';
import { useEditor } from './Context';

export interface EditorContextMenuProps extends Pick<Store, 'selected' | 'clipboard'> {
  children: React.ReactElement;
}

function EditorContextMenu({ children, clipboard, selected }: EditorContextMenuProps) {
  const execCommand = useEditor();

  const position = useRef({ x: 0, y: 0 });

  const onOpen = (evt: React.MouseEvent) => {
    const { currentTarget } = evt;
    const rect = currentTarget.getBoundingClientRect();
    const top = currentTarget.scrollTop;
    const left = currentTarget.scrollLeft;
    position.current.x = evt.clientX - rect.left + left;
    position.current.y = evt.clientY - rect.top + top;
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

  return (
    <ContextMenuTrigger onOpen={onOpen} getMenu={getMenu}>
      {children}
    </ContextMenuTrigger>
  );
}

export default EditorContextMenu;
