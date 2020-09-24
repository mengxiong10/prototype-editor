import React from 'react';
import type { CompositeData } from 'src/editor/type';
import { useComponentId, useCompositePath, useEditor } from './Context';
import { createCompositeData } from './componentUtil';

export interface CompositeDropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  path?: string;
  drop: string;
  children: React.ReactNode;
}

function CompositeDropZone({ path = 'children', children, drop, ...rest }: CompositeDropZoneProps) {
  const execCommand = useEditor();
  const cid = useComponentId();
  const prefixPath = useCompositePath();

  const onDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData('type');
    const currentDrop = evt.dataTransfer.getData('drop');
    if (drop !== currentDrop) {
      return;
    }
    evt.stopPropagation();
    const newData = createCompositeData(type);
    const prop = prefixPath ? `${prefixPath}.${path}` : `${path}`;

    execCommand('updateById', {
      id: cid,
      path: prop,
      value: (list: CompositeData[]) => [...list, newData],
    });
  };

  const onDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
  };

  return (
    <div {...rest} onDrop={onDrop} onDragOver={onDragOver}>
      {children}
    </div>
  );
}

export default CompositeDropZone;
