import React, { useState, useEffect, useCallback } from 'react';
import DrawShape, { ShapeData } from 'src/components/DrawShape';
import { useClickOutside } from 'src/hooks/useClickOutside';
import { useEditor } from 'src/editor/Context';
import { EventDrawing } from 'src/editor/event';
import { createComponentData } from '../componentUtil';

function StageDrawing({ scale = 1 }: { scale?: number }) {
  const execCommand = useEditor();
  const [type, setType] = useState('');

  const hideDrawer = useCallback(() => {
    setType('');
  }, []);

  const ref = useClickOutside({
    onClick: hideDrawer,
  });

  const handleStop = useCallback(
    (value: ShapeData) => {
      hideDrawer();
      Object.keys(value).forEach((k: keyof ShapeData) => {
        value[k] /= scale;
      });
      if (type === 'comment') {
        const richData = createComponentData('rich', {
          left: value.left + value.width + 200,
          top: value.top,
        });
        const rect = createComponentData('rect', {
          ...value,
          association: richData.id,
        });
        execCommand('add', rect);
        execCommand('add', richData);
      } else {
        execCommand('add', createComponentData(type, value));
      }
    },
    [execCommand, hideDrawer, scale, type]
  );

  useEffect(() => {
    return EventDrawing.on((value: string) => {
      setType(value);
    });
  }, []);

  return (
    <DrawShape shapeStyle={{ border: '1px solid rgb(211, 208, 0)' }} onStop={handleStop}>
      <div
        ref={ref}
        style={{
          display: type ? 'block' : 'none',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 20,
          cursor: 'crosshair',
        }}></div>
    </DrawShape>
  );
}

export default React.memo(StageDrawing);
