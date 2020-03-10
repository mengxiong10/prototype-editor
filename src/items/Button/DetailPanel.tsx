import React from 'react';
import { Collapse, Input } from 'antd';
import { RowFlex } from 'my-react-common';
import { ButtonProps } from './Button';
import { DetailPanelComponent } from '@/editor/DetailPanel';

const { Panel } = Collapse;

export type ButtonDetailPanelProps = DetailPanelComponent<ButtonProps>;

function ButtonDetailPanel(props: ButtonDetailPanelProps) {
  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    props.onDetailPanelChange({ textContent: value });
  };

  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="外观" key="1">
        <RowFlex align="middle" justify="space-between">
          <span>文字内容</span>
          <Input style={{ width: 150 }} value={props.textContent} onChange={handleInputChange} />
        </RowFlex>
      </Panel>
    </Collapse>
  );
}

export default ButtonDetailPanel;
