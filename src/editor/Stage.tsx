import React, { useCallback } from 'react';
import DropZone, { DropDoneHandler } from './DropZone';
import { useEditor } from './Context';
import { ComponentData, ComponentId } from '@/types/editor';
import ComponentWrapper from './ComponentWrapper';
import DragSelect, { DragSelectHandler } from '../components/DragSelect';
import { actions, createComponentData } from './reducer';

export interface StageProps {
  data: ComponentData[];
  selected: ComponentId[];
}

function Stage({ data, selected }: StageProps) {
  const dispatch = useEditor();

  const handleAddComponent: DropDoneHandler = useCallback(
    ({ data: type, x, y }) => {
      const componentdata = createComponentData(type, x - 20, y - 20);
      if (componentdata) {
        dispatch(actions.add(componentdata));
      }
    },
    [dispatch]
  );

  const handleCancelSelect = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        dispatch(actions.select([]));
      }
    },
    [dispatch]
  );

  // TODO: 可以放到stage的mousedown里面去, 通过closest拿到id
  const handleSelect = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      const { currentTarget } = evt;
      const id = currentTarget.dataset.id!;
      dispatch(actions.select(id));
    },
    [dispatch]
  );

  const handleDragSelect: DragSelectHandler = useCallback(
    value => {
      dispatch(actions.selectArea(value));
    },
    [dispatch]
  );

  return (
    <DragSelect onDrag={handleDragSelect}>
      <DropZone
        className="pe-content"
        onMouseDown={handleCancelSelect}
        onDropDone={handleAddComponent}
        tabIndex={-1}
      >
        {data.map(item => (
          <ComponentWrapper
            data={item}
            data-id={item.id}
            key={item.id}
            active={selected.indexOf(item.id) !== -1}
            onMouseDownCapture={handleSelect}
          />
        ))}
      </DropZone>
    </DragSelect>
  );
}

export default Stage;
