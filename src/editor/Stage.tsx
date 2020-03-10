import React, { useCallback } from 'react';
import DropZone, { DropDoneHandler } from './DropZone';
import { useEditorDispatch } from './EditorContext';
import { ComponentData } from '@/types/editor';
import ComponentWrapper from './ComponentWrapper';
import DragSelect, { DragSelectHandler } from '../components/DragSelect';

export interface StageProps {
  data: ComponentData[];
  selected: string[];
}

function Stage({ data, selected }: StageProps) {
  const dispatch = useEditorDispatch();

  const addComponent: DropDoneHandler = useCallback(
    ({ data: type, x, y }) => {
      dispatch({ type: 'add', payload: { type, top: y - 20, left: x - 20 } });
    },
    [dispatch]
  );

  const handleSelect = useCallback(
    (id: string | string[]) => {
      dispatch({ type: 'select', payload: { id } });
    },
    [dispatch]
  );

  const handleCancelSelect = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        handleSelect([]);
      }
    },
    [handleSelect]
  );

  const handleDragSelect: DragSelectHandler = value => {
    const id: string[] = [];
    const { left, top, width, height } = value;
    const right = left + width;
    const bottom = top + height;
    data.forEach(v => {
      const { left: x, top: y, width: w, height: h } = v.position;
      if (left <= x + w && right >= x && top <= y + h && bottom >= y) {
        id.push(v.id);
      }
    });
    handleSelect(id);
  };

  return (
    <DragSelect onDrag={handleDragSelect}>
      <DropZone className="pe-content" onMouseDown={handleCancelSelect} onDropDone={addComponent}>
        {data.map(item => (
          <ComponentWrapper
            {...item}
            key={item.id}
            active={selected.indexOf(item.id) !== -1}
            onSelect={handleSelect}
          />
        ))}
      </DropZone>
    </DragSelect>
  );
}

export default Stage;
