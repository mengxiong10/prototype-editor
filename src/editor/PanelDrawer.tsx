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
    console.log('click');
    setType('');
  }, []);

  const ref = useClickOutside({
    onClick: hideDrawer,
  });

  console.log(type);

  const handleStop = ({ left, top, width, height }: ShapeData) => {
    hideDrawer();
    const componentdata = createComponentData(type, { left, top }, { width, height });
    dispatch(actions.add(componentdata));
  };

  useEffect(() => {
    return drawerEvent.on((value: string) => {
      setType(value);
    });
  }, []);

  if (!type) {
    return null;
  }
  return (
    <DrawShape
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 20,
        cursor: 'crosshair',
      }}
      ref={ref}
      shapeStyle={{ border: '1px solid rgb(211, 208, 0)' }}
      onStop={handleStop}
    />
  );
}

export default React.memo(PanelDrawer);
