import React from 'react';
import { FileAddOutlined } from '@ant-design/icons';

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
      <FileAddOutlined />
      <span style={{ marginTop: 5, fontSize: 12 }}>{children}</span>
    </div>
  );
}

export default ComponentItem;
