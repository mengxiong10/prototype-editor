import React from 'react';
import type { ComponentData, ComponentId, ComponentStatusMap } from 'src/types/editor';
import { mergeObjectDeep } from 'src/utils/object';
import { get } from 'dot-prop-immutable';
import { getComponent } from './componentUtil';
import PanelDetail from './PanelDetail';

export interface PanelDetailWrapperProps {
  data: ComponentData[];
  selected: ComponentId[];
  status: ComponentStatusMap;
}

function PanelDetailWrapper({ data, selected, status }: PanelDetailWrapperProps) {
  const selectedData = data.filter((v) => selected.indexOf(v.id) !== -1);

  // 选择的组件都是同一个类型
  const isSelected =
    selectedData.length > 0 && selectedData.every((v) => v.type === selectedData[0].type);

  if (!isSelected) {
    return null;
  }

  let resolvedData = selectedData[0];

  let resolvedPath = '';

  let resolvedType = resolvedData.type;

  if (selectedData.length === 1 && status[resolvedData.id]) {
    resolvedPath = status[resolvedData.id].selectedPath;
    resolvedType = status[resolvedData.id].selectedType;
  }

  if (resolvedPath) {
    resolvedData = get(resolvedData, resolvedPath);
  }

  const componentOption = getComponent(resolvedType);

  if (!componentOption || !componentOption.detailPanel) {
    return null;
  }

  const { detailPanel, defaultData } = componentOption;

  resolvedData = mergeObjectDeep(defaultData, resolvedData || {});

  return <PanelDetail data={resolvedData} detailPanel={detailPanel} path={resolvedPath} />;
}

export default PanelDetailWrapper;
