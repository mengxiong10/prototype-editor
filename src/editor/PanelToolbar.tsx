import React from 'react';
import { RowFlex } from 'my-react-common';
import { Tooltip, Button } from 'antd';
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import BorderOutlined from '@ant-design/icons/BorderOutlined';
import { ActionCreators } from 'redux-undo';
import { ButtonProps } from 'antd/lib/button';
import Redo from '@/svg/redo.svg';
import Undo from '@/svg/undo.svg';
import AlignLeft from '@/svg/align-left-fill.svg';
import AlignTop from '@/svg/align-top-fill.svg';
import AlignBottom from '@/svg/align-bottom-fill.svg';
import AlignRight from '@/svg/align-right-fill.svg';
import AlignCenter from '@/svg/align-center-fill.svg';
import AlignVerticel from '@/svg/align-verticle-fill.svg';
import HorizontalSpace from '@/svg/horizontal-space.svg';
import VerticalSpace from '@/svg/vertical-space.svg';
import { drawingEvent } from './event';
import { useEditor } from './Context';
import { Store } from './reducer';
import { actions } from './reducer/data';

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
        <Undo />
      </ButtonIcon>
      <ButtonIcon
        title="重做(ctrl+shift+z)"
        disabled={data.future.length === 0}
        onClick={() => dispatch(ActionCreators.redo())}
      >
        <Redo />
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
      {divider}
      <ButtonIcon title="左对齐" onClick={() => dispatch(actions.align('left'))}>
        <AlignLeft />
      </ButtonIcon>
      <ButtonIcon title="水平居中" onClick={() => dispatch(actions.align('horizontal'))}>
        <AlignCenter />
      </ButtonIcon>
      <ButtonIcon title="右对齐" onClick={() => dispatch(actions.align('right'))}>
        <AlignRight />
      </ButtonIcon>
      <ButtonIcon title="顶对齐" onClick={() => dispatch(actions.align('top'))}>
        <AlignTop />
      </ButtonIcon>
      <ButtonIcon title="垂直居中" onClick={() => dispatch(actions.align('vertical'))}>
        <AlignVerticel />
      </ButtonIcon>
      <ButtonIcon title="底对齐" onClick={() => dispatch(actions.align('bottom'))}>
        <AlignBottom />
      </ButtonIcon>
      <ButtonIcon title="水平等间距" onClick={() => dispatch(actions.space('horizontal'))}>
        <HorizontalSpace />
      </ButtonIcon>
      <ButtonIcon title="垂直等间距" onClick={() => dispatch(actions.space('vertical'))}>
        <VerticalSpace />
      </ButtonIcon>
    </RowFlex>
  );
}

export default PanelToolbar;
