import React, { useCallback } from 'react';
import { getComponent } from './registerComponents';
import { useEditor } from './Context';
import { ComponentData, ComponentId } from '@/types/editor';
import { actions } from './reducer';
import DetailPanel from './DetailPanel';

export interface DetailPanelWrapper {
  data: ComponentData[];
  selected: ComponentId[];
}

function DetailPanelWrapper({ data, selected }: DetailPanelWrapper) {
  const dispatch = useEditor();

  const selectedData = data.filter(v => selected.indexOf(v.id) !== -1);

  const isSelected =
    selectedData.length > 0 && selectedData.every(v => v.type === selectedData[0].type);

  const component = isSelected ? getComponent(selectedData[0].type) : null;

  const handleChange = useCallback(
    (obj: any) => {
      dispatch(actions.updateData({ data: obj }));
    },
    [dispatch]
  );

  return (
    <div className="pe-detail-panel">
      {component &&
        component.detailPanel &&
        (Array.isArray(component.detailPanel) ? (
          <DetailPanel
            groups={component.detailPanel}
            onChange={handleChange}
            data={{ ...component.defaultData, ...selectedData[0].data }}
          />
        ) : (
          React.createElement(component.detailPanel as React.ElementType, {
            ...component.defaultData,
            ...selectedData[0].data,
            onChange: handleChange,
          })
        ))}
    </div>
  );
}

export default DetailPanelWrapper;
