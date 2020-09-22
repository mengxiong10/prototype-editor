import React from 'react';
import { Collapse } from 'antd';
import { itemMap, DetailPanelRowProps, PanelChangeHandler } from './Helpers';

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

export interface DetailPanelDefaultProps {
  data: any;
  groups: DetailPanelGroup[];
  children?: React.ReactNode;
  onChange: PanelChangeHandler;
}

function DetailPanelDefault({ groups, data, onChange, children }: DetailPanelDefaultProps) {
  return (
    <Collapse
      className="pe-detail-panel"
      style={{ border: 0 }}
      defaultActiveKey={groups.map((v, i) => String(i))}>
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

export default DetailPanelDefault;
