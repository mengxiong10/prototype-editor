import React, { useState, useEffect, useCallback } from 'react';
import DrawShape, { ShapeData } from 'src/components/DrawShape';
import { useClickOutside } from 'src/hooks/useClickOutside';
import { useEditor } from './Context';
import { actions } from './reducer';
import { createComponentData } from './componentUtil';
import { drawingEvent } from './event';

function PanelDrawing() {
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
      if (type === 'comment') {
        const richData = createComponentData('rich', {
          left: value.left + value.width + 200,
          top: value.top,
        });
        const rect = createComponentData('rect', {
          ...value,
          association: richData.id,
        });
        dispatch(actions.add(rect));
        dispatch(actions.add(richData));
      } else {
        const componentdata = createComponentData(type, value);
        dispatch(actions.add(componentdata));
      }
    },
    [dispatch, hideDrawer, type]
  );

  useEffect(() => {
    return drawingEvent.on((value: string) => {
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

export default React.memo(PanelDrawing);
