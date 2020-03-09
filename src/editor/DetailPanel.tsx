import React from 'react';
import { Unionize } from 'utility-types';
import { getComponent } from './components';
import { useEditorDispatch } from './EditorContext';
import { ComponentData } from '@/types/editor';

export type DetailPanelComponent<T extends object> = T & {
  onDetailPanelChange: (obj: Unionize<T>) => void;
};

export interface DetailPanel {
  data: ComponentData[];
  selected: string[];
}

function DetailPanel({ data, selected }: DetailPanel) {
  const dispatch = useEditorDispatch();

  const selectedData = data.filter(v => selected.indexOf(v.id) !== -1);

  const isSelected =
    selectedData.length > 0 && selectedData.every(v => v.type === selectedData[0].type);

  const component = isSelected ? getComponent(selectedData[0].type) : null;

  const handleChange = (obj: any) => {
    return dispatch({
      type: 'update',
      payload: {
        id: selected,
        data: obj,
      },
    });
  };

  return (
    <div className="pe-detail-panel">
      {component &&
        component.detailPanel &&
        React.createElement(component.detailPanel, {
          ...component.defaultData,
          ...selectedData[0].data,
          onDetailPanelChange: handleChange,
        })}
    </div>
  );
}

export default DetailPanel;
