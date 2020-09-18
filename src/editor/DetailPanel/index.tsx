import React, { useState, useEffect } from 'react';
import type { ComponentData, ComponentId } from 'src/editor/type';
import { mergeObjectDeep } from 'src/utils/object';
import { get } from 'dot-prop-immutable';
import { getComponent } from 'src/editor/componentUtil';
import { EventCompositeSelect, EventCompositeSelectProps } from 'src/editor/event';
import DetailPanelContainer from './DetailPanelContainer';

export interface PanelDetailProps {
  data: ComponentData[];
  selected: ComponentId[];
}

function PanelDetail({ data, selected }: PanelDetailProps) {
  const selectedData = data.filter((v) => selected.indexOf(v.id) !== -1);

  const [composite, setComposite] = useState<EventCompositeSelectProps | null>(null);

  useEffect(() => {
    return EventCompositeSelect.on(setComposite);
  }, []);

  useEffect(() => {
    // 如果是多选或者当前的组件和复合组件的状态id不一致, 直接清空复合组件的状态
    if (composite && !(selectedData.length === 1 && selectedData[0].id === composite.id)) {
      EventCompositeSelect.emit(null);
    }
  });

  // 选择的组件都是同一个类型
  const isSelected =
    selectedData.length > 0 && selectedData.every((v) => v.type === selectedData[0].type);

  if (!isSelected) {
    return null;
  }

  let config = selectedData[0];
  if (composite && config.id === composite.id) {
    config = get(config, composite.path);
  }

  const componentOption = getComponent(config.type);

  if (!componentOption || !componentOption.detailPanel) {
    return null;
  }

  const { detailPanel, defaultData } = componentOption;

  const resolvedData = mergeObjectDeep(defaultData, config.data || {});

  const path = composite ? composite.path : '';

  return <DetailPanelContainer data={resolvedData} detailPanel={detailPanel} path={path} />;
}

export default PanelDetail;
