import React, { useMemo } from 'react';
import { getComponent } from './registerComponents';
import { ComponentData } from '@/types/editor';

export function useComponent({
  type,
  componentData,
}: {
  type: string;
  componentData: ComponentData;
}) {
  const component = useMemo(() => {
    const componentOption = getComponent(type);

    return React.createElement(componentOption.component, {
      ...componentOption.defaultData,
      ...componentData,
    });
  }, [componentData, type]);

  return component;
}
