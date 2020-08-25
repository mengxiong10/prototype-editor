import React, { useEffect, useState } from 'react';
import { useComponentId } from './Context';
import { EventCompositeSelect } from './event';

export interface CompositeWrapperProps {
  path: string;
  type: string;
  children: React.ReactNode;
}

function CompositeWrapper({ path, type, children }: CompositeWrapperProps) {
  const [selected, setSelected] = useState(false);

  const id = useComponentId();

  useEffect(() => {
    return EventCompositeSelect.on((data) => {
      setSelected(!!data && path === data.path && type === data.type && id === data.id);
    });
  }, [id, path, type]);

  const handleSelect = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (evt.ctrlKey) {
      return;
    }
    evt.stopPropagation();
    EventCompositeSelect.emit({ path, type, id });
  };

  return (
    <div
      onClick={handleSelect}
      style={{ outline: selected ? '1px solid red' : 'none' }}
      data-path={path}
      data-type={type}
    >
      {children}
    </div>
  );
}

export default CompositeWrapper;
