import React, { useMemo } from 'react';
import { mergeDeepObject } from 'src/utils/object';
import { getComponent } from './componentUtil';

export function useComponent({ type, data }: { type: string; data: any }) {
  const component = useMemo(() => {
    const componentOption = getComponent(type);

    return React.createElement(
      componentOption.component,
      mergeDeepObject(componentOption.defaultData, data)
    );
  }, [data, type]);

  return component;
}
