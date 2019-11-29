import React from 'react';
import { Icon } from 'antd';

export interface ComponentItemProps {
  children: React.ReactNode;
  type: string;
}

function ComponentItem({ type, children }: ComponentItemProps) {
  const handleDragStart = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.dataTransfer.setData('type', type);
  };

  return (
    <div className="pe-component-item" draggable onDragStart={handleDragStart}>
      <Icon type="file-add" />
      {children}
    </div>
  );
}

export default React.memo(ComponentItem);
