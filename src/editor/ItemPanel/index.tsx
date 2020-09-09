import React from 'react';
import { Collapse } from 'antd';
import type { ComponentOptions } from 'src/types/editor';
import PanelItem from './PanelItem';

const { Panel } = Collapse;

export interface ItemPanelTreeItem {
  key: string;
  name: string;
  children: { type: string; options: ComponentOptions; name: string }[];
}

export interface ItemPanelProps {
  data: ItemPanelTreeItem[];
}

function ItemPanel({ data }: ItemPanelProps) {
  return (
    <Collapse style={{ border: 0 }} defaultActiveKey={[data[0].key]}>
      {data.map((item) => (
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
