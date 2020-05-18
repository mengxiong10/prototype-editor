import React, { HTMLAttributes } from 'react';
import { RowFlex } from 'my-react-common';
import { Divider } from 'antd';
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import BorderOutlined from '@ant-design/icons/BorderOutlined';
import { drawingEvent } from './event';

export interface ButtonIconProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ButtonIcon = ({ children, ...rest }: ButtonIconProps) => {
  return (
    <RowFlex align="middle" style={{ cursor: 'pointer' }} {...rest}>
      {children}
    </RowFlex>
  );
};

const id = 'toolbar';

function PanelToolbar() {
  return (
    <RowFlex
      id={id}
      align="middle"
      style={{
        height: 40,
        flex: '0 0 40px',
        padding: '0 16px',
        lineHeight: 1,
        borderBottom: '1px solid #e8e8e8',
      }}
    >
      <ButtonIcon onClick={() => drawingEvent.emit('rect')}>
        <BorderOutlined />
        <span style={{ marginLeft: 4 }}>方框</span>
      </ButtonIcon>
      <Divider type="vertical" />
      <ButtonIcon onClick={() => drawingEvent.emit('comment')}>
        <CommentOutlined />
        <span style={{ marginLeft: 4 }}>标注</span>
      </ButtonIcon>
    </RowFlex>
  );
}

export default PanelToolbar;
