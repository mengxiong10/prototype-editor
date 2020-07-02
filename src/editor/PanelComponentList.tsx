import React from 'react';
import { Collapse } from 'antd';
import ComponentItem from './PanelComponentItem';
import { shortcuts } from './componentUtil';

const { Panel } = Collapse;

function ComponentList() {
  return (
    <Collapse style={{ border: 0 }} defaultActiveKey={['0']}>
      {shortcuts.map((item, index) => (
        <Panel header={item.group} key={String(index)}>
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
