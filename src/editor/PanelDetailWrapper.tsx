import React, { useCallback } from 'react';
import type { ComponentData, ComponentId } from 'src/types/editor';
import { mergeDeepObject } from 'src/utils/object';
import { getComponent } from './componentUtil';
import { useEditor } from './Context';
import { actions } from './reducer';
import DetailPanel from './PanelDetail';

export interface PanelDetailWrapper {
  data: ComponentData[];
  selected: ComponentId[];
}

export type PanelChangeHandler = (data: any, config?: { history?: boolean }) => void;

function PanelDetailWrapper({ data, selected }: PanelDetailWrapper) {
  const dispatch = useEditor();

  const selectedData = data.filter(v => selected.indexOf(v.id) !== -1);

  const isSelected =
    selectedData.length > 0 && selectedData.every(v => v.type === selectedData[0].type);

  const componentOption = isSelected ? getComponent(selectedData[0].type) : null;

  const handleChange: PanelChangeHandler = useCallback(
    (value, config) => {
      const { history } = { history: true, ...config };
      if (!value) {
        return dispatch(actions.recordHistory());
      }
      if (!history) {
        return dispatch(actions.updateWithoutHistory({ data: value }));
      }
      return dispatch(actions.update({ data: value }));
    },
    [dispatch]
  );

  if (!(componentOption && componentOption.detailPanel)) {
    return null;
  }

  const componentData = mergeDeepObject(componentOption.defaultData, selectedData[0].data)

  return Array.isArray(componentOption.detailPanel) ? (
    <DetailPanel
      data={componentData}
      groups={componentOption.detailPanel}
      onChange={handleChange}
    />
  ) : (
    React.createElement(componentOption.detailPanel as React.ElementType, {
      data: componentData,
      onChange: handleChange,
    })
  );
}

export default PanelDetailWrapper;
