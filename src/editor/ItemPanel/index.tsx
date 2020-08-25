import React from 'react';
import { Collapse } from 'antd';
import { itemPanelTree } from 'src/items/index';
import PanelItem from './PanelItem';

const { Panel } = Collapse;

function ItemPanel() {
  return (
    <Collapse style={{ border: 0 }} defaultActiveKey={[itemPanelTree[0].key]}>
      {itemPanelTree.map((item) => (
        <Panel header={item.name} key={item.key}>
          {item.children.map((v) => (
            <PanelItem key={v.type} type={v.type}>
              {v.name}
            </PanelItem>
          ))}
        </Panel>
      ))}
    </Collapse>
  );
}

export default React.memo(ItemPanel);
