import React, { useCallback, useRef } from 'react';
import ContextMenuTrigger from 'src/components/ContextMenuTrigger';
import DrawShape, { ShapeData } from 'src/components/DrawShape';
import { useDrop } from 'src/hooks/useDrop';
import { useEditor } from 'src/editor/Context';
import { useContextmenu } from 'src/editor/useContextMenu';
import { actions } from 'src/editor/reducer';
import type { Store } from 'src/editor/reducer/type';
import { isValidComponent } from 'src/editor/componentUtil';
import { useShortcuts } from 'src/editor/useShortcuts';
import StageDrawing from './StageDrawing';
import ComponentWrapper from './ComponentWrapper';
import StageCanvas from './StageCanvas';
import ResizeHandlers from './ResizeHandlers';

export type StageProps = Pick<Store, 'data' | 'selected' | 'clipboard' | 'scale'>;

function Stage({ data, selected, clipboard, scale }: StageProps) {
  const dispatch = useEditor();

  const selectedData = data.present.filter((v) => selected.indexOf(v.id) !== -1);

  const contextmenuProps = useContextmenu({ data, selected, clipboard });

  const stageRef = useRef<HTMLDivElement>(null);

  useShortcuts(stageRef);

  const dropProps = useDrop({
    onDropDone: ({ data: type, x, y }) => {
      if (!type || !isValidComponent(type)) return;
      dispatch(actions.add({ type, left: x / scale - 20, top: y / scale - 20 }));
    },
  });

  const handleSelect = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        dispatch(actions.select([]));
        return true;
      }
      return false;
    },
    [dispatch]
  );

  const handleDragMove = ({ left, top, width, height }: ShapeData) => {
    dispatch(
      actions.selectArea({
        left: left / scale,
        top: top / scale,
        width: width / scale,
        height: height / scale,
      })
    );
  };

  return (
    <ContextMenuTrigger {...contextmenuProps}>
      <DrawShape onStart={handleSelect} onMove={handleDragMove}>
        <div
          ref={stageRef}
          className="pe-editor-stage"
          style={{
            width: 2000,
            height: 1000,
          }}
          tabIndex={-1}
          {...dropProps}
        >
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'left top' }}>
            {data.present.map((item) => (
              <ComponentWrapper
                key={item.id}
                item={item}
                active={selected.indexOf(item.id) !== -1}
                scale={scale}
              />
            ))}
            <StageCanvas width={2000} height={1000} data={data.present} />
          </div>
          {selectedData.length > 0 && <ResizeHandlers scale={scale} selectedData={selectedData} />}
          <StageDrawing scale={scale} />
        </div>
      </DrawShape>
    </ContextMenuTrigger>
  );
}

export default Stage;
