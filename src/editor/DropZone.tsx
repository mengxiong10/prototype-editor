import React from 'react';

export type DropDoneData = { x: number; y: number; data: string };

export type DropDoneHandler = (v: DropDoneData) => void;

export interface DropZoneProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement;
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

  return React.cloneElement(children, {
    ...rest,
    onDrop: handleDrop,
    onDragOver: handleDragOver,
  });
}

export default DropZone;
