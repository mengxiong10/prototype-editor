import React from 'react';
import { createComponentData, isValidComponent } from 'src/editor/componentUtil';
import { useEditor } from '../Context';

export type DropDoneData = { x: number; y: number; data: string };

export type DropDoneHandler = (v: DropDoneData) => void;

export interface DropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  scale: number;
}

function ComponentDropZone({ children, scale, ...rest }: DropZoneProps) {
  const execCommand = useEditor();

  const onDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData('type');
    const drop = evt.dataTransfer.getData('drop');
    if (!type || !isValidComponent(type)) return;
    if (drop) {
      return;
    }
    const rect = evt.currentTarget.getBoundingClientRect();
    const y = evt.clientY - rect.top + evt.currentTarget.scrollTop;
    const x = evt.clientX - rect.left + evt.currentTarget.scrollLeft;
    execCommand('add', createComponentData(type, { left: x / scale - 20, top: y / scale - 20 }));
  };

  const onDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
  };

  return (
    <div onDrop={onDrop} onDragOver={onDragOver} {...rest}>
      {children}
    </div>
  );
}

export default ComponentDropZone;
