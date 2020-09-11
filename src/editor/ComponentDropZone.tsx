import React from 'react';
import { createComponentData, isValidComponent } from 'src/editor/componentUtil';
import { useEditor } from './Context';

export type DropDoneData = { x: number; y: number; data: string };

export type DropDoneHandler = (v: DropDoneData) => void;

export interface DropZoneProps {
  children: React.ReactElement;
  scale: number;
}

function ComponentDropZone({ children, scale }: DropZoneProps) {
  const execCommand = useEditor();

  const onDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData('type');
    if (!type || !isValidComponent(type)) return;
    if (type.indexOf('.') !== -1) {
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

  return React.cloneElement(children, {
    onDrop,
    onDragOver,
  });
}

export default ComponentDropZone;
