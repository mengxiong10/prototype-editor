import React, { useCallback } from 'react';
import { getComponent } from './componentUtil';
import { useEditor } from './Context';
import { ComponentData, ComponentId } from '@/types/editor';
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

  const component = isSelected ? getComponent(selectedData[0].type) : null;

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

  if (!(component && component.detailPanel)) {
    return null;
  }

  return Array.isArray(component.detailPanel) ? (
    <DetailPanel
      data={{ ...component.defaultData, ...selectedData[0].data }}
      groups={component.detailPanel}
      onChange={handleChange}
    />
  ) : (
    React.createElement(component.detailPanel as React.ElementType, {
      ...component.defaultData,
      ...selectedData[0].data,
      onChange: handleChange,
    })
  );
}

export default PanelDetailWrapper;
