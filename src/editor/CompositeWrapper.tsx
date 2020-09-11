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

  useEffect(() => {
    return EventCompositeSelect.on((option) => {
      setSelected(!!option && path === option.path && type === option.type && cid === option.id);
    });
  }, [cid, path, type]);

  const component = useComponent({ type, data, children });

  return (
    <CompositePathContext.Provider value={path}>
      <div
        className={compositWrapperClassName}
        style={{ outline: selected ? '1px solid red' : 'none' }}
        data-type={type}
        data-path={path}
      >
        {component}
      </div>
    </CompositePathContext.Provider>
  );
}

export default CompositeWrapper;
