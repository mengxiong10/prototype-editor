import React from 'react';
import { Collapse } from 'antd';
import type { ComponentOptions } from 'src/editor/type';
import PanelItem from './PanelItem';

const { Panel } = Collapse;

export interface ItemPanelItem {
  type: string;
  drop?: string;
  name: string;
  options: ComponentOptions;
  children?: ItemPanelItem[];
}

export interface ItemPanelGroup {
  key: string;
  name: string;
  children: ItemPanelItem[];
}

export interface ItemPanelProps {
  data: ItemPanelGroup[];
}

function ItemPanel({ data }: ItemPanelProps) {
  return (
    <Collapse ghost style={{ border: 0 }} defaultActiveKey={[data[0].key]}>
      {data.map((item) => (
        <Panel header={item.name} key={item.key}>
          {item.children.map((v) => {
            if (v.children) {
              return (
                <Collapse key={v.type} ghost>
                  <Panel
                    header={
                      <PanelItem key={v.type} type={v.type} drop={v.drop}>
                        {v.name}
                      </PanelItem>
                    }
                    key={v.type}>
                    {v.children.map((q) => (
                      <PanelItem key={q.type} type={q.type} drop={q.drop} size="small">
                        {q.name}
                      </PanelItem>
                    ))}
                  </Panel>
                </Collapse>
              );
            }
            return (
              <PanelItem key={v.type} type={v.type} drop={v.drop}>
                {v.name}
              </PanelItem>
            );
          })}
        </Panel>
      ))}
    </Collapse>
  );
}

export default React.memo(ItemPanel);
