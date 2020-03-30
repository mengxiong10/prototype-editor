import React from 'react';
import { Collapse } from 'antd';
import ComponentItem from './PanelComponentItem';

const { Panel } = Collapse;

function ComponentList() {
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="基础组件" key="1">
        <ComponentItem type="button">按钮</ComponentItem>
        <ComponentItem type="input">单行输入</ComponentItem>
      </Panel>
    </Collapse>
  );
}

export default ComponentList;
