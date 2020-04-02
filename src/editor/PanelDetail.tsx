import React from 'react';
import { Collapse } from 'antd';
import { itemMap } from './PanelDetailHelper';

const { Panel } = Collapse;

export interface DetailPanelItem<P> {
  title: string;
  prop: P;
  type: keyof typeof itemMap;
}

export interface DetailPanelGroup<P = string> {
  title: string;
  list: DetailPanelItem<P>[];
}

export interface DetailPanelProps {
  groups: DetailPanelGroup[];
  data: any;
  onChange: (obj: any) => void;
  children?: React.ReactNode;
}

function DetailPanel({ groups, data, children, onChange }: DetailPanelProps) {
  return (
    <Collapse className="pe-detail-panel" defaultActiveKey={groups.map((v, i) => String(i))}>
      {groups.map((group, i) => {
        return (
          <Panel header={group.title} key={String(i)}>
            {group.list.map(({ type, title, prop, ...rest }) => {
              const com = typeof type === 'string' ? itemMap[type] : type;
              return React.createElement(com, {
                ...rest,
                key: prop,
                prop,
                title,
                value: data[prop],
                onChange,
              });
            })}
          </Panel>
        );
      })}
      {children}
    </Collapse>
  );
}

export default DetailPanel;
