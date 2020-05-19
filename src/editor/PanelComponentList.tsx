import React from 'react';
import { Collapse } from 'antd';
import ComponentItem from './PanelComponentItem';
import { shortcuts } from './registerComponents';

const { Panel } = Collapse;

function ComponentList() {
  return (
    <Collapse style={{ border: 0 }} defaultActiveKey={[shortcuts[0].key]}>
      {shortcuts.map(item => (
        <Panel header={item.title} key={item.key}>
          {item.children.map(v => (
            <ComponentItem type={v.type}>{v.name}</ComponentItem>
          ))}
        </Panel>
      ))}
    </Collapse>
  );
}

export default React.memo(ComponentList);
