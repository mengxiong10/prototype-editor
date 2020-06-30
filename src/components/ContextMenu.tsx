import React, { useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { Menu } from 'antd';
import type { ClickParam } from 'antd/lib/menu';
import { useClickOutside } from 'src/hooks/useClickOutside';
import 'antd/es/dropdown/style/index.css';

export interface ContextMenuItem {
  type?: 'Item';
  title: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  key: string;
  handler: () => any;
}

export interface ContextMenuDivider {
  type: 'Divider';
}

export type ContextMenuOption = ContextMenuItem | ContextMenuDivider;

export interface MenuPosition {
  left: number;
  top: number;
}

export interface ContextMenuProps {
  position: MenuPosition;
  onChangePosition: (v: MenuPosition) => void;
  getMenu: () => ContextMenuOption[];
  onClose: () => void;
}

function ContextMenu(props: ContextMenuProps) {
  const { getMenu, onClose, position, onChangePosition } = props;

  const menu = getMenu();

  const node = useClickOutside({ onClick: onClose });

  const handleMenuClick = ({ key }: ClickParam) => {
    const item = menu.find((o: ContextMenuItem) => o.key === key) as ContextMenuItem;
    if (item && item.handler) {
      Promise.resolve(item.handler()).then(() => {
        onClose();
      });
    }
  };

  useLayoutEffect(() => {
    // 检查position的位置是否超过屏幕, 重新定位
    const el = node.current!;
    const rect = el.getBoundingClientRect();
    const { width, height } = rect;
    let { top, left } = position;
    const { innerHeight, innerWidth } = window;
    if (top + height > innerHeight) {
      top -= height;
    }
    if (left + width > innerWidth) {
      left -= width;
    }
    if (top < 0) {
      top = height < innerHeight ? (innerHeight - height) / 2 : 0;
    }
    if (left < 0) {
      left = width < innerWidth ? (innerWidth - width) / 2 : 0;
    }
    if (top !== position.top || left !== position.left) {
      onChangePosition({ top, left });
    }
  }, [node, onChangePosition, position]);

  return ReactDOM.createPortal(
    <div
      ref={node}
      style={{
        position: 'fixed',
        zIndex: 2000,
        ...position,
      }}
    >
      <Menu prefixCls="ant-dropdown-menu" style={{ minWidth: 180 }} onClick={handleMenuClick}>
        {menu.map((item, i) => {
          if (item.type === 'Divider') {
            return <Menu.Divider key={String(i)} />;
          }
          return (
            <Menu.Item
              style={{ display: 'flex', justifyContent: 'space-between' }}
              key={item.key}
              disabled={item.disabled}
            >
              <span>{item.title}</span>
              {item.shortcut !== undefined && <span>{item.shortcut}</span>}
            </Menu.Item>
          );
        })}
      </Menu>
    </div>,
    document.body
  );
}

export default ContextMenu;
