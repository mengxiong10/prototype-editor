import React, { useCallback, SetStateAction } from 'react';
import DropZone, { DropDoneHandler } from './DropZone';
import { useEditorDispatch } from './Context';
import { ComponentData } from '@/types/editor';
import ComponentWrapper from './ComponentWrapper';
import DragSelect, { DragSelectHandler } from '../components/DragSelect';
import { actions } from './reducer';
import { getComponent } from './components';
import { randomId } from '@/utils/randomId';

export interface StageProps {
  data: Readonly<ComponentData[]>;
  selected: string;
  onSelect: (id: SetStateAction<string>) => void;
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

function Stage({ data, selected, onSelect }: StageProps) {
  const dispatch = useEditorDispatch();

  const handleAddComponent: DropDoneHandler = ({ data: type, x, y }) => {
    const componentdata = createComponentData(type, x - 20, y - 20);
    if (componentdata) {
      dispatch(actions.add(componentdata));
      onSelect(componentdata.id);
    }
  };

  const handleCancelSelect = (evt: React.MouseEvent) => {
    if (evt.target === evt.currentTarget) {
      onSelect('');
    }
  };

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
    onSelect(id.join(','));
  };

  // componentWrapper memo
  const handleSelect = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      const { currentTarget } = evt;
      const id = currentTarget.dataset.id!;
      onSelect(id);
    },
    [onSelect]
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
            active={selected.split(',').indexOf(item.id) !== -1}
            onMouseDownCapture={handleSelect}
          />
        ))}
      </DropZone>
    </DragSelect>
  );
}

export default Stage;
