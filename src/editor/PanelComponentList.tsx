import React from 'react';
import { Collapse } from 'antd';
import ComponentItem from './PanelComponentItem';
import { leftComponentTree } from '../items/index';

const { Panel } = Collapse;

function ComponentList() {
  return (
    <Collapse style={{ border: 0 }} defaultActiveKey={[leftComponentTree[0].key]}>
      {leftComponentTree.map((item) => (
        <Panel header={item.name} key={item.key}>
          {item.children.map((v) => (
            <ComponentItem key={v.type} type={v.type}>
              {v.name}
            </ComponentItem>
          ))}
        </Panel>
      ))}
    </Collapse>
  );
}

export default React.memo(ComponentList);
