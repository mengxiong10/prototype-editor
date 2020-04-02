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

function PanelStage2({ data, selected }: PanelStage2Props) {
  const dispatch = useEditor();

  const contextmenuProps = useContextmenu({ data, selected });

  const stageRef = useRef<HTMLDivElement>(null);

  const { onMouseMove } = useShortcuts();

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
      } else {
        const wrapper = (evt.target as Element).closest('.pe-component-wrapper');
        if (wrapper && wrapper !== evt.target) {
          const id = (wrapper as HTMLDivElement).dataset.id!;
          dispatch(actions.select(id));
        }
      }
    },
    [dispatch]
  );

  const handleDragSelect = (value: ShapeData) => {
    dispatch(actions.selectArea(value));
  };

  return (
    <ContextMenu handle=".ant-dropdown-menu-item" {...contextmenuProps}>
      <DrawShape
        ref={stageRef}
        className="pe-editor-stage"
        style={{ width: 2000, height: 1000 }}
        tabIndex={-1}
        onMouseDown={handleSelect}
        onMouseMove={onMouseMove}
        onMove={handleDragSelect}
        {...dropProps}
      >
        {data.map(item => (
          <ComponentWrapper key={item.id} data={item} active={selected.indexOf(item.id) !== -1} />
        ))}
      </DrawShape>
    </ContextMenu>
  );
}

export default PanelStage2;
