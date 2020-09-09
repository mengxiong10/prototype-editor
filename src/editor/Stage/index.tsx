import React, { useCallback, useRef } from 'react';
import DrawShape, { ShapeData } from 'src/components/DrawShape';
import { useDrop } from 'src/hooks/useDrop';
import { useEditor } from 'src/editor/Context';
import type { Store } from 'src/editor/reducer/type';
import { isValidComponent } from 'src/editor/componentUtil';
import { useShortcuts } from 'src/editor/useShortcuts';
import StageDrawing from './StageDrawing';
import ComponentWrapper from './ComponentWrapper';
import StageCanvas from './StageCanvas';
import ResizeHandlers from './ResizeHandlers';

export type StageProps = Pick<Store, 'data' | 'selected' | 'scale'>;

function Stage({
  data,
  selected,
  scale,
  ...rest
}: StageProps & React.HTMLAttributes<HTMLDivElement>) {
  const execCommand = useEditor();

  const selectedData = data.present.filter((v) => selected.indexOf(v.id) !== -1);

  const stageRef = useRef<HTMLDivElement>(null);

  useShortcuts(stageRef);

  const dropProps = useDrop({
    onDropDone: ({ data: type, x, y }) => {
      if (!type || !isValidComponent(type)) return;
      execCommand('add', { type, left: x / scale - 20, top: y / scale - 20 });
    },
  });

  const handleSelect = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        execCommand('select', []);
        return true;
      }
      return false;
    },
    [execCommand]
  );

  const handleDragMove = ({ left, top, width, height }: ShapeData) => {
    execCommand('selectArea', {
      left: left / scale,
      top: top / scale,
      width: width / scale,
      height: height / scale,
    });
  };

  return (
    <div className="pe-content u-scroll" {...rest} {...dropProps}>
      <DrawShape onStart={handleSelect} onMove={handleDragMove}>
        <div
          ref={stageRef}
          className="pe-editor-stage"
          style={{
            width: 2000,
            height: 1000,
          }}
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
    </div>
  );
}

export default Stage;
