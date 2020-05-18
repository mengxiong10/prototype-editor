import React, { HTMLAttributes } from 'react';
import { RowFlex } from 'my-react-common';
import { Divider } from 'antd';
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import { drawerEvent } from './PanelDrawer';

export interface ButtonIconProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ButtonIcon = ({ children, ...rest }: ButtonIconProps) => {
  return (
    <div style={{ cursor: 'pointer' }} {...rest}>
      {children}
    </div>
  );
};

const id = 'toolbar';

function PanelToolbar() {
  return (
    <RowFlex
      id={id}
      align="middle"
      style={{ height: 40, flex: '0 0 40px', padding: '0 16px', borderBottom: '1px solid #e8e8e8' }}
    >
      <ButtonIcon onClick={() => drawerEvent.emit('rect')}>方框</ButtonIcon>
      <Divider type="vertical" />
      <ButtonIcon>
        <CommentOutlined />
        <span style={{ marginLeft: 8 }}>标注</span>
      </ButtonIcon>
    </RowFlex>
  );
}

export default PanelToolbar;
