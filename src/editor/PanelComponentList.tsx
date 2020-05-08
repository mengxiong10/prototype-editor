import React from 'react';
import { Collapse } from 'antd';
import ComponentItem from './PanelComponentItem';

const { Panel } = Collapse;

function ComponentList() {
  return (
    <Collapse style={{ border: 0 }} defaultActiveKey={['1']}>
      <Panel header="基础组件" key="1">
        <ComponentItem type="button">按钮</ComponentItem>
        <ComponentItem type="input">单行输入</ComponentItem>
        <ComponentItem type="comment">哈哈</ComponentItem>
      </Panel>
    </Collapse>
  );
}

export default React.memo(ComponentList);
