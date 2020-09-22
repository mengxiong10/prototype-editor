import React, { useEffect, useState } from 'react';
import { CompositePathContext, useComponentId, useCompositePath } from './Context';
import { EventCompositeSelect } from './event';
import { useComponent } from './useComponent';

export interface CompositeWrapperProps {
  index: number | string;
  type: string;
  data: any;
  children?: any;
}

export const compositWrapperClassName = 'js-composite-wrapper';

function CompositeWrapper({ index, type, data, children }: CompositeWrapperProps) {
  const [selected, setSelected] = useState(false);
  const cid = useComponentId();
  const prefixPath = useCompositePath();

  const path = prefixPath ? `${prefixPath}.children.${index}` : `children.${index}`;

  const component = useComponent({ type, data, children });

  useEffect(() => {
    return EventCompositeSelect.on((option) => {
      const v = !!option && path === option.path && cid === option.id;
      setSelected(v);
    });
  }, [cid, path]);

  return (
    <CompositePathContext.Provider value={path}>
      <div
        className={compositWrapperClassName}
        style={{ outline: selected ? '3px solid skyblue' : 'none' }}
        data-path={path}>
        {component}
      </div>
    </CompositePathContext.Provider>
  );
}

export default CompositeWrapper;
