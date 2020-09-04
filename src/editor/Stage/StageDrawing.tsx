import React, { useState, useEffect, useCallback } from 'react';
import DrawShape, { ShapeData } from 'src/components/DrawShape';
import { useClickOutside } from 'src/hooks/useClickOutside';
import { useEditor } from 'src/editor/Context';
import { actions } from 'src/editor/reducer';
import { EventDrawing } from 'src/editor/event';
import { createComponentData } from '../componentUtil';

function StageDrawing({ scale = 1 }: { scale?: number }) {
  const dispatch = useEditor();
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
        const richData = createComponentData({
          left: value.left + value.width + 200,
          top: value.top,
          type: 'rich',
        });
        const rect = createComponentData({
          ...value,
          type: 'rect',
          association: richData.id,
        });
        dispatch(actions.add(rect));
        dispatch(actions.add(richData));
      } else {
        dispatch(actions.add({ ...value, type }));
      }
    },
    [dispatch, hideDrawer, scale, type]
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
        }}
      ></div>
    </DrawShape>
  );
}

export default React.memo(StageDrawing);
