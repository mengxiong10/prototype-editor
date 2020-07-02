import React from 'react';
import { Collapse } from 'antd';
import { itemMap, DetailPanelRowProps } from './PanelDetailHelper';
import type { PanelDetailBaseProps } from './PanelDetail';

const { Panel } = Collapse;

export interface DetailPanelItem<T = any> {
  title: string;
  prop: Extract<keyof T, string>; // 去掉symbol 或 number
  type: keyof typeof itemMap | React.JSXElementConstructor<DetailPanelRowProps>;
}

export interface DetailPanelGroup<T = any> {
  title: string;
  list: DetailPanelItem<T>[];
}

export interface PanelDetailDefaultProps extends PanelDetailBaseProps {
  groups: DetailPanelGroup[];
  children?: React.ReactNode;
}

function PanelDetailDefault({ groups, data, children, onChange }: PanelDetailDefaultProps) {
  return (
    <Collapse
      className="pe-detail-panel"
      style={{ border: 0 }}
      defaultActiveKey={groups.map((v, i) => String(i))}
    >
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

export default PanelDetailDefault;
