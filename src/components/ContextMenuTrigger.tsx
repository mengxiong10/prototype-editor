import React, { useState, useCallback } from 'react';
import ContextMenu, { ContextMenuOption } from './ContextMenu';

export interface ContextMenuTriggerProps {
  children: React.ReactElement;
  getMenu: () => ContextMenuOption[];
  onOpen?: (evt: React.MouseEvent) => void;
}

function ContextMenuTrigger(props: ContextMenuTriggerProps) {
  const { children, getMenu, onOpen } = props;
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

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

  const trigger = React.cloneElement(children, {
    onContextMenu: handleContextMenu,
    key: 'trigger',
  });

  let portal: React.ReactElement | null = null;

  if (visible) {
    portal = (
      <ContextMenu
        key="portal"
        getMenu={getMenu}
        position={position}
        onChangePosition={setPosition}
        onClose={handleClose}
      />
    );
  }

  return (
    <>
      {trigger}
      {portal}
    </>
  );
}

export default ContextMenuTrigger;
