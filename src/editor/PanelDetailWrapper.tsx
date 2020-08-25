import React from 'react';
import type { ComponentData, ComponentId } from 'src/types/editor';
import { mergeObjectDeep } from 'src/utils/object';
import { getComponent } from './componentUtil';
import PanelDetail from './PanelDetail';

export interface PanelDetailWrapperProps {
  data: ComponentData[];
  selected: ComponentId[];
}

function PanelDetailWrapper({ data, selected }: PanelDetailWrapperProps) {
  const selectedData = data.filter((v) => selected.indexOf(v.id) !== -1);

  // 选择的组件都是同一个类型
  const isSelected =
    selectedData.length > 0 && selectedData.every((v) => v.type === selectedData[0].type);

  if (!isSelected) {
    return null;
  }

  const resolvedType = selectedData[0].type;

  const componentOption = getComponent(resolvedType);

  if (!componentOption || !componentOption.detailPanel) {
    return null;
  }

  const { detailPanel, defaultData } = componentOption;

  const resolvedData = mergeObjectDeep(defaultData, selectedData[0].data || {});

  return <PanelDetail data={resolvedData} detailPanel={detailPanel} path="" />;
}

export default PanelDetailWrapper;
