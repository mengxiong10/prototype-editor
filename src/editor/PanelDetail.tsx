import React, { useState, useEffect } from 'react';
import type { ComponentData, ComponentId } from 'src/types/editor';
import { mergeObjectDeep } from 'src/utils/object';
import { get } from 'dot-prop-immutable';
import { getComponent } from './componentUtil';
import PanelDetailContainer from './PanelDetailContainer';
import { EventCompositeSelect, EventCompositeSelectProps } from './event';

export interface PanelDetailProps {
  data: ComponentData[];
  selected: ComponentId[];
}

function PanelDetail({ data, selected }: PanelDetailProps) {
  const [composite, setComposite] = useState<EventCompositeSelectProps | null>(null);

  useEffect(() => {
    return EventCompositeSelect.on(setComposite);
  }, []);

  const selectedData = data.filter((v) => selected.indexOf(v.id) !== -1);

  // 选择的组件都是同一个类型
  const isSelected =
    selectedData.length > 0 && selectedData.every((v) => v.type === selectedData[0].type);

  // 如果是多选或者当前的组件和复合组件的状态id不一致, 直接清空复合组件的状态
  if (composite && !(selectedData.length === 1 && selectedData[0].id === composite.id)) {
    EventCompositeSelect.emit(null);
  }

  if (!isSelected) {
    return null;
  }

  const config = selectedData[0];

  let resolvedType = config.type;
  let resolvedData = config.data;

  let path = '';

  if (composite && config.id === composite.id) {
    path = composite.path;
    resolvedType = composite.type;
    resolvedData = get(resolvedData, composite.path);
  }

  const componentOption = getComponent(resolvedType);

  if (!componentOption || !componentOption.detailPanel) {
    return null;
  }

  const { detailPanel, defaultData } = componentOption;

  resolvedData = mergeObjectDeep(defaultData, resolvedData || {});

  return <PanelDetailContainer data={resolvedData} detailPanel={detailPanel} path={path} />;
}

export default PanelDetail;
