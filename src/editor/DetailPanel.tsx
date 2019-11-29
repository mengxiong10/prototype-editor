import React from 'react';
import { Unionize } from 'utility-types';
import { getComponent } from './component';
import { useEditorAPI, useEditorData } from './EditorContext';

export type DetailPanelComponent<T extends object> = T & {
  onDetailPanelChange: (obj: Unionize<T>) => void;
};

function DetailPanel() {
  const { updateComponent } = useEditorAPI();
  const { selected, data } = useEditorData();

  const selectedData = data.filter(v => selected.indexOf(v.id) !== -1);

  const isSelected =
    selectedData.length > 0 && selectedData.every(v => v.type === selectedData[0].type);

  const component = isSelected ? getComponent(selectedData[0].type) : null;

  const handleComponentChange = (value: any) => {
    return updateComponent(selected, value);
  };

  return (
    <div className="pe-detail-panel">
      {component &&
        component.detailPanel &&
        React.createElement(component.detailPanel, {
          ...component.defaultData,
          ...selectedData[0].data,
          onDetailPanelChange: handleComponentChange,
        })}
    </div>
  );
}

export default DetailPanel;
