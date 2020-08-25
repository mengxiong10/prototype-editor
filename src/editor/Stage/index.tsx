import React, { useCallback, useRef } from 'react';
import ContextMenuTrigger from 'src/components/ContextMenuTrigger';
import DrawShape, { ShapeData } from 'src/components/DrawShape';
import { useDrop } from 'src/hooks/useDrop';
import { useEditor } from 'src/editor/Context';
import { useContextmenu } from 'src/editor/useContextMenu';
import { actions, Store } from 'src/editor/reducer';
import { createComponentData, isValidComponent } from 'src/editor/componentUtil';
import { useShortcuts } from 'src/editor/useShortcuts';
import StageDrawing from './StageDrawing';
import ComponentWrapper from './ComponentWrapper';
import StageCanvas from './StageCanvas';
import ResizeHandlers from './ResizeHandlers';

export type StageProps = Pick<Store, 'data' | 'selected'>;

function Stage({ data, selected }: StageProps) {
  const dispatch = useEditor();

  const selectedData = data.present.filter((v) => selected.indexOf(v.id) !== -1);

  const contextmenuProps = useContextmenu({ data, selected });

  const stageRef = useRef<HTMLDivElement>(null);

  useShortcuts(stageRef);

  const dropProps = useDrop({
    onDropDone: ({ data: type, x, y }) => {
      if (!type || !isValidComponent(type)) return;
      const componentdata = createComponentData(type, { left: x - 20, top: y - 20 });
      dispatch(actions.add(componentdata));
    },
  });

  const handleSelect = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        dispatch(actions.select([]));
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
          {data.present.map((item) => (
            <ComponentWrapper key={item.id} item={item} active={selected.indexOf(item.id) !== -1} />
          ))}
          <StageCanvas width={2000} height={1000} data={data.present} />
          {selectedData.length > 0 && <ResizeHandlers selectedData={selectedData} />}
          <StageDrawing />
        </div>
      </DrawShape>
    </ContextMenuTrigger>
  );
}

export default Stage;
