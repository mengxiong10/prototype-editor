import React, { useCallback, useRef } from 'react';
import ContextMenuTrigger from '@/components/ContextMenuTrigger';
import DrawShape, { ShapeData } from '@/components/DrawShape';
import { useEditor } from './Context';
import { useContextmenu } from './useContextMenu';
import { actions, Store } from './reducer';
import { createComponentData, isValidComponent } from './componentUtil';
import { useDrop } from '@/hooks/useDrop';
import PanelDrawing from './PanelDrawing';

import { useShortcuts } from './useShortcuts';
import ComponentWrapper from './ComponentWrapper';
import PanelCanvas from './PanelCanvas';
import ResizeHandlers from './ResizeHandlers';

export interface PanelStage2Props extends Store {}

function PanelStage({ data, selected }: PanelStage2Props) {
  const dispatch = useEditor();

  const selectedData = data.present.filter(v => selected.indexOf(v.id) !== -1);

  const contextmenuProps = useContextmenu({ data, selected });

  const stageRef = useRef<HTMLDivElement>(null);

  useShortcuts(stageRef);

  const dropProps = useDrop({
    onDropDone: ({ data: type, x, y }) => {
      if (!type || !isValidComponent(type)) return;
      const componentdata = createComponentData({ type, left: x - 20, top: y - 20 });
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
    <ContextMenuTrigger {...contextmenuProps}>
      <DrawShape onMouseDown={handleSelect} onMove={handleDragMove}>
        <div
          ref={stageRef}
          className="pe-editor-stage"
          style={{ width: 2000, height: 1000 }}
          tabIndex={-1}
          {...dropProps}
        >
          {data.present.map(item => (
            <ComponentWrapper key={item.id} item={item} active={selected.indexOf(item.id) !== -1} />
          ))}
          <PanelCanvas width={2000} height={1000} data={data.present} />
          {selectedData.length > 0 && <ResizeHandlers selectedData={selectedData} />}
          <PanelDrawing />
        </div>
      </DrawShape>
    </ContextMenuTrigger>
  );
}

export default PanelStage;
