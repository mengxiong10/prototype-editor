import React, { useRef } from 'react';
import { Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import { useEditor } from './Context';
import { actions, pasteComponentData, Store } from './reducer';
import 'antd/es/dropdown/style/index.css';

type ContextMenuOption = { title?: string; key: string; type?: 'Item' | 'Divider' };

const componentContextMenu: ContextMenuOption[] = [
  { title: '删除', key: 'del' },
  { type: 'Divider', key: 'd1' },
  { title: '剪切', key: 'cut' },
  { title: '复制', key: 'copy' },
];

const stageContextMenu: ContextMenuOption[] = [{ title: '粘贴', key: 'paste' }];

export function useContextmenu({ selected }: Store) {
  const dispatch = useEditor();

  const position = useRef({ x: 0, y: 0 });

  const onOpen = (evt: React.MouseEvent) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    position.current.x = evt.clientX - rect.left;
    position.current.y = evt.clientY - rect.top;
  };

  const handleMenuClick = ({ key }: ClickParam) => {
    switch (key) {
      case 'del':
        dispatch(actions.del());
        break;
      case 'cut':
        dispatch(actions.cut());
        break;
      case 'copy':
        dispatch(actions.copy());
        break;
      case 'paste':
        dispatch(actions.add(pasteComponentData(position.current)));
        break;
      default:
        throw new TypeError(`invalid arguments ${key}`);
    }
  };

  const options = selected.length ? componentContextMenu : stageContextMenu;
  const overlay = (
    <Menu prefixCls="ant-dropdown-menu" onClick={handleMenuClick}>
      {options.map(item => {
        if (item.type === 'Divider') {
          return <Menu.Divider key={item.key} />;
        }
        return <Menu.Item key={item.key}>{item.title}</Menu.Item>;
      })}
    </Menu>
  );

  return { overlay, onOpen };
}
