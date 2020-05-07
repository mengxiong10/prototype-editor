import React, { useState, useEffect, useCallback } from 'react';
import DrawShape, { ShapeData } from '@/components/DrawShape';
import { TypedEvent } from '@/utils/typedEvent';
import { useEditor } from './Context';
import { createComponentData, actions } from './reducer';
import { useClickOutside } from '@/hooks/useClickOutside';

export const drawerEvent = new TypedEvent<string>();

function PanelDrawer() {
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
      const componentdata = createComponentData(type, value);
      dispatch(actions.add(componentdata));
    },
    [dispatch, hideDrawer, type]
  );

  useEffect(() => {
    return drawerEvent.on((value: string) => {
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

export default React.memo(PanelDrawer);
