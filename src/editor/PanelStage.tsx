import React, { useCallback, useRef } from 'react';
import ContextMenu from '@/components/ContextMenu';
import DrawShape, { ShapeData } from '@/components/DrawShape';
import { useEditor } from './Context';
import { ComponentData, ComponentId } from '@/types/editor';
import { useContextmenu } from './useContextMenu';
import { actions, createComponentData } from './reducer';
import { useDrop } from '@/hooks/useDrop';
import { useShortcuts } from './useShortcuts';
import ComponentWrapper from './ComponentWrapper';

export interface PanelStage2Props {
  data: ComponentData[];
  selected: ComponentId[];
}

function PanelStage({ data, selected }: PanelStage2Props) {
  const dispatch = useEditor();

  const contextmenuProps = useContextmenu({ data, selected });

  const stageRef = useRef<HTMLDivElement>(null);

  useShortcuts(stageRef);

  const dropProps = useDrop({
    onDropDone: ({ data: type, x, y }) => {
      const componentdata = createComponentData(type, { left: x - 20, top: y - 20 });
      dispatch(actions.add(componentdata));
    },
  });

  const handleSelect = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        dispatch(actions.selectClear());
      }
    },
    [dispatch]
  );

  const handleDragMove = (value: ShapeData) => {
    dispatch(actions.selectArea(value));
  };

  return (
    <ContextMenu handle=".ant-dropdown-menu-item" {...contextmenuProps}>
      <DrawShape onMouseDown={handleSelect} onMove={handleDragMove}>
        <div
          ref={stageRef}
          className="pe-editor-stage"
          style={{ width: 2000, height: 1000 }}
          tabIndex={-1}
          {...dropProps}
        >
          {data.map(item => (
            <ComponentWrapper key={item.id} item={item} active={selected.indexOf(item.id) !== -1} />
          ))}
        </div>
      </DrawShape>
    </ContextMenu>
  );
}

export default PanelStage;
