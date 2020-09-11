import React, { useMemo } from 'react';
import { mergeObjectDeep } from 'src/utils/object';
import { getComponent } from './componentUtil';

export function useComponent({ type, data, children }: { type: string; data: any; children: any }) {
  const component = useMemo(() => {
    const componentOption = getComponent(type);

    const mergedData = mergeObjectDeep(componentOption.defaultData, data);

    if (mergedData.children === undefined && children !== undefined) {
      mergedData.children = children;
    }

    return React.createElement(componentOption.component, mergedData);
  }, [children, data, type]);

  return component;
}
