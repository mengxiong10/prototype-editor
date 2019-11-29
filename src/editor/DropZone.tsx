import React from 'react';
import { Position } from './Editor';

export interface DropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onDropDone: (type: string, position: Position) => void;
}

function DropZone({ onDropDone, children, ...rest }: DropZoneProps) {
  const handleDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    const type = evt.dataTransfer.getData('type');
    const rect = evt.currentTarget.getBoundingClientRect();
    const top = evt.clientY - rect.top - 20;
    const left = evt.clientX - rect.left - 20;
    onDropDone(type, { top, left });
  };

  const handleDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
  };

  return (
    <div {...rest} onDrop={handleDrop} onDragOver={handleDragOver}>
      {children}
    </div>
  );
}

export default React.memo(DropZone);
