import React, { useRef } from 'react';
import DrawShape, { ShapeData } from 'src/components/DrawShape';
import { useEditor } from 'src/editor/Context';
import type { Store } from 'src/editor/type';
import { useShortcuts } from 'src/editor/useShortcuts';
import EditingTextArea from 'src/editor/EditingTextArea';
import ComponentDropZone from 'src/editor/Stage/ComponentDropZone';
import ComponentWrapper from 'src/editor/Stage/ComponentWrapper';
import StageDrawing from './StageDrawing';
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

  const handleSelect = (evt: React.MouseEvent) => {
    if (evt.target === evt.currentTarget) {
      execCommand('select', []);
      return true;
    }
    return false;
  };

  const handleDragMove = ({ left, top, width, height }: ShapeData) => {
    execCommand('selectArea', {
      left: left / scale,
      top: top / scale,
      width: width / scale,
      height: height / scale,
    });
  };

  return (
    <ComponentDropZone className="pe-content u-scroll" scale={scale} {...rest}>
      <DrawShape onStart={handleSelect} onMove={handleDragMove}>
        <div
          ref={stageRef}
          className="pe-editor-stage"
          style={{
            width: 2000,
            height: 1000,
          }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'left top' }}>
            {data.present.map((item) => (
              <ComponentWrapper
                key={item.id}
                item={item}
                active={selected.indexOf(item.id) !== -1}
                scale={scale}
              />
            ))}
          </div>
          <StageCanvas data={data.present} scale={scale} />
          {selectedData.length > 0 && <ResizeHandlers scale={scale} selectedData={selectedData} />}
          <StageDrawing scale={scale} />
          <EditingTextArea scale={scale} />
        </div>
      </DrawShape>
    </ComponentDropZone>
  );
}

export default Stage;
