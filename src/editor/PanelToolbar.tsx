import React from 'react';
import { RowFlex } from 'my-react-common';
import { Tooltip, Button } from 'antd';
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import BorderOutlined from '@ant-design/icons/BorderOutlined';
import RedoOutlined from '@ant-design/icons/RedoOutlined';
import UndoOutlined from '@ant-design/icons/UndoOutlined';
import { ActionCreators } from 'redux-undo';
import { ButtonProps } from 'antd/lib/button';
import { drawingEvent } from './event';
import { useEditor } from './Context';
import { Store } from './reducer';

export interface PanelToolbarProps extends Store {}

export interface ButtonIconProps extends Omit<ButtonProps, 'title'> {
  title: React.ReactNode;
}

const ButtonIcon = ({ title, ...rest }: ButtonIconProps) => {
  return (
    <Tooltip title={title}>
      <Button
        size="small"
        style={{ height: '100%', border: 'none', background: 'none' }}
        {...rest}
      />
    </Tooltip>
  );
};

const id = 'toolbar';

function PanelToolbar({ data }: PanelToolbarProps) {
  const dispatch = useEditor();

  const divider = (
    <div style={{ height: '60%', width: 1, background: '#e8e8e8', margin: '0 8px' }}></div>
  );

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
      <ButtonIcon
        title="撤销(ctrl+z)"
        disabled={data.past.length === 0}
        onClick={() => dispatch(ActionCreators.undo())}
      >
        <UndoOutlined />
      </ButtonIcon>
      <ButtonIcon
        title="重做(ctrl+shift+z)"
        disabled={data.future.length === 0}
        onClick={() => dispatch(ActionCreators.redo())}
      >
        <RedoOutlined />
      </ButtonIcon>
      {divider}
      <ButtonIcon title="重点标记" onClick={() => drawingEvent.emit('rect')}>
        <BorderOutlined />
        <span style={{ marginLeft: 4 }}>方框</span>
      </ButtonIcon>
      {divider}
      <ButtonIcon title="添加批注" onClick={() => drawingEvent.emit('comment')}>
        <CommentOutlined />
        <span style={{ marginLeft: 4 }}>标注</span>
      </ButtonIcon>
    </RowFlex>
  );
}

export default PanelToolbar;
