import React, { useCallback } from 'react';
import DropZone, { DropDoneHandler } from './DropZone';
import { useEditorDispatch } from './EditorContext';
import { ComponentData } from '@/types/editor';
import ComponentWrapper from './ComponentWrapper';

export interface StageProps {
  data: ComponentData[];
  selected: string[];
}

function Stage({ data }: StageProps) {
  const dispatch = useEditorDispatch();

  const handleDropDone: DropDoneHandler = useCallback(
    ({ data: type, x, y }) => {
      dispatch({ type: 'add', payload: { type, top: y - 20, left: x - 20 } });
    },
    [dispatch]
  );

  return (
    <DropZone className="pe-content" onDropDone={handleDropDone}>
      {data.map(item => (
        <ComponentWrapper key={item.id} {...item} />
      ))}
    </DropZone>
  );
}

export default Stage;
