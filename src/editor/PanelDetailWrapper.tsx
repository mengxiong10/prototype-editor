import React, { useState, useEffect } from 'react';
import type { ComponentData, ComponentId } from 'src/types/editor';
import { mergeDeepObject } from 'src/utils/object';
import { get } from 'dot-prop-immutable';
import { getComponent } from './componentUtil';
import PanelDetail from './PanelDetail';
import { detailChangeEvent, DetailChangeEvent } from './event';

export interface PanelDetailWrapperProps {
  data: ComponentData[];
  selected: ComponentId[];
}

function PanelDetailWrapper({ data, selected }: PanelDetailWrapperProps) {
  const [detail, setDetail] = useState<DetailChangeEvent | null>(null);

  const { path, type } = detail || { path: '', type: '' };

  useEffect(() => detailChangeEvent.on(setDetail), []);

  const selectedData = data.filter((v) => selected.indexOf(v.id) !== -1);

  // 选择的组件都是同一个类型
  const isSelected =
    selectedData.length > 0 && selectedData.every((v) => v.type === selectedData[0].type);

  if (!isSelected) {
    return null;
  }

  // 当只有一个组件选中, 而且自定义的type属性是当前选中组件的子组件
  const isValidType = type && selectedData.length === 1 && type.indexOf(selectedData[0].type) === 0;

  const resolvedType = isValidType ? type : selectedData[0].type;

  const resolvedPath = isValidType ? path : '';

  const componentOption = getComponent(resolvedType);

  if (!componentOption || !componentOption.detailPanel) {
    return null;
  }

  const { detailPanel, defaultData } = componentOption;

  let componentData = selectedData[0].data;

  if (resolvedPath) {
    componentData = get(componentData, resolvedPath);
  }

  componentData = mergeDeepObject(defaultData, componentData || {});

  return <PanelDetail data={componentData} detailPanel={detailPanel} path={resolvedPath} />;
}

export default PanelDetailWrapper;
