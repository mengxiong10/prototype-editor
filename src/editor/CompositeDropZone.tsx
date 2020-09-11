import React from 'react';
import { set } from 'dot-prop-immutable';
import type { CompositeData } from 'src/editor/type';
import { useComponentId, useCompositePath, useEditor } from './Context';
import { createCompositeData } from './componentUtil';

export interface CompositeDropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  path?: string;
  match: string | ((type: string) => boolean);
  children: React.ReactNode;
}

function CompositeDropZone({
  path = 'children',
  children,
  match,
  ...rest
}: CompositeDropZoneProps) {
  const execCommand = useEditor();
  const cid = useComponentId();
  const prefixPath = useCompositePath();

  const onDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData('type');
    if (!(match === type || (typeof match === 'function' && match(type)))) {
      return;
    }
    evt.stopPropagation();
    const newData = createCompositeData(type);
    const prop = prefixPath ? `${prefixPath}.${path}` : `${path}`;

    execCommand('updateById', {
      id: cid,
      updater: (item) => {
        return set(item, prop, (list: CompositeData[]) => [...list, newData]);
      },
    });
  };

  const onDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
  };

  return (
    <div
      {...rest}
      style={{ minWidth: 100, minHeight: 100, border: '1px solid red' }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {children}
    </div>
  );
}

export default CompositeDropZone;
