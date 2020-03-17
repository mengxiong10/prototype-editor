import React, { useCallback } from 'react';
import DropZone, { DropDoneHandler } from './DropZone';
import { useEditor } from './Context';
import { ComponentData, ComponentId } from '@/types/editor';
import ComponentWrapper from './ComponentWrapper';
import DragSelect, { DragSelectHandler } from '../components/DragSelect';
import { actions } from './reducer';
import { getComponent } from './registerComponents';
import { randomId } from '@/utils/randomId';

export interface StageProps {
  data: ComponentData[];
  selected: ComponentId[];
}

const createComponentData = (type: string, left: number, top: number): ComponentData | null => {
  const component = getComponent(type);
  const id = randomId();
  if (!component) {
    console.warn(`${type} 没有注册`);
    return null;
  }
  const { width, height } = component.defaultSize || { width: 200, height: 200 };
  return {
    type,
    id,
    position: { top, left, width, height },
    data: {},
  };
};

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
