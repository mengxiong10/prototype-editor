import React, { useState, useCallback, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { useClickOutside } from '@/hooks/useClickOutside';

export interface ContextMenuProps {
  children: React.ReactElement;
  overlay: React.ReactNode;
  handle?: string;
  onOpen?: (evt: React.MouseEvent) => void;
}

function ContextMenu(props: ContextMenuProps) {
  const { children, overlay, handle, onOpen } = props;
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [visible, setVisible] = useState(false);

  const hideMenu = useCallback(() => {
    setVisible(false);
  }, []);

  const node = useClickOutside({ onClick: hideMenu });

  const handleContextMenu = useCallback(
    (evt: React.MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (onOpen) {
        onOpen(evt);
      }
      const { clientX, clientY } = evt;
      setPosition({ left: clientX, top: clientY });
      setVisible(true);
    },
    [onOpen]
  );

  const handleMenuClick = (evt: React.MouseEvent) => {
    const { target } = evt;
    if (!handle || (target as Element).matches(handle)) {
      setVisible(false);
    }
  };

  useLayoutEffect(() => {
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
      setPosition({ top, left });
    }
  }, [node, position]);

  return (
    <>
      {React.cloneElement(children, {
        onContextMenu: handleContextMenu,
        key: 'children',
      })}
      {ReactDOM.createPortal(
        <div
          ref={node}
          className="contextmenu"
          style={{
            display: visible ? 'block' : 'none',
            position: 'fixed',
            zIndex: 2000,
            ...position,
          }}
          onClick={handleMenuClick}
        >
          {overlay}
        </div>,
        document.body
      )}
    </>
  );
}

export default ContextMenu;
