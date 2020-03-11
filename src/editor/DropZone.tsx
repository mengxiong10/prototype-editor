import React from 'react';

export type DropDoneHandler = (v: { x: number; y: number; data: string }) => void;

export interface DropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onDropDone: DropDoneHandler;
  format?: string;
}

function DropZone({ onDropDone, children, format = 'type', ...rest }: DropZoneProps) {
  const handleDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    const data = evt.dataTransfer.getData(format);
    const rect = evt.currentTarget.getBoundingClientRect();
    const y = evt.clientY - rect.top;
    const x = evt.clientX - rect.left;
    onDropDone({ x, y, data });
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

export default DropZone;
