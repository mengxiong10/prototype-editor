import React from 'react';
import { Tooltip, Button } from 'antd';
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import BorderOutlined from '@ant-design/icons/BorderOutlined';
import type { ButtonProps } from 'antd/lib/button';
import Redo from 'src/svg/redo.svg';
import Undo from 'src/svg/undo.svg';
import AlignLeft from 'src/svg/align-left-fill.svg';
import AlignTop from 'src/svg/align-top-fill.svg';
import AlignBottom from 'src/svg/align-bottom-fill.svg';
import AlignRight from 'src/svg/align-right-fill.svg';
import AlignCenter from 'src/svg/align-center-fill.svg';
import AlignVerticel from 'src/svg/align-verticle-fill.svg';
import HorizontalSpace from 'src/svg/horizontal-space.svg';
import VerticalSpace from 'src/svg/vertical-space.svg';
import { EventDrawing } from './event';
import { useEditor } from './Context';
import { Store, actions } from './reducer';

export type PanelToolbarProps = Pick<Store, 'data' | 'selected'>;

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

function PanelToolbar({ data, selected }: PanelToolbarProps) {
  const dispatch = useEditor();

  const divider = (
    <div style={{ height: '60%', width: 1, background: '#e8e8e8', margin: '0 8px' }}></div>
  );

  return (
    <div
      id={id}
      style={{
        display: 'flex',
        alignItems: 'center',
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
        onClick={() => dispatch(actions.undo())}
      >
        <Undo />
      </ButtonIcon>
      <ButtonIcon
        title="重做(ctrl+shift+z)"
        disabled={data.future.length === 0}
        onClick={() => dispatch(actions.redo())}
      >
        <Redo />
      </ButtonIcon>
      {divider}
      <ButtonIcon title="重点标记" onClick={() => EventDrawing.emit('rect')}>
        <BorderOutlined />
        <span style={{ marginLeft: 4 }}>方框</span>
      </ButtonIcon>
      {divider}
      <ButtonIcon title="添加批注" onClick={() => EventDrawing.emit('comment')}>
        <CommentOutlined />
        <span style={{ marginLeft: 4 }}>标注</span>
      </ButtonIcon>
      {divider}
      <ButtonIcon
        title="左对齐"
        disabled={selected.length < 2}
        onClick={() => dispatch(actions.align('left'))}
      >
        <AlignLeft />
      </ButtonIcon>
      <ButtonIcon
        title="水平居中"
        disabled={selected.length < 2}
        onClick={() => dispatch(actions.align('horizontal'))}
      >
        <AlignCenter />
      </ButtonIcon>
      <ButtonIcon
        title="右对齐"
        disabled={selected.length < 2}
        onClick={() => dispatch(actions.align('right'))}
      >
        <AlignRight />
      </ButtonIcon>
      <ButtonIcon
        title="顶对齐"
        disabled={selected.length < 2}
        onClick={() => dispatch(actions.align('top'))}
      >
        <AlignTop />
      </ButtonIcon>
      <ButtonIcon
        title="垂直居中"
        disabled={selected.length < 2}
        onClick={() => dispatch(actions.align('vertical'))}
      >
        <AlignVerticel />
      </ButtonIcon>
      <ButtonIcon
        title="底对齐"
        disabled={selected.length < 2}
        onClick={() => dispatch(actions.align('bottom'))}
      >
        <AlignBottom />
      </ButtonIcon>
      <ButtonIcon
        title="水平等间距"
        disabled={selected.length < 3}
        onClick={() => dispatch(actions.space('horizontal'))}
      >
        <HorizontalSpace />
      </ButtonIcon>
      <ButtonIcon
        title="垂直等间距"
        disabled={selected.length < 3}
        onClick={() => dispatch(actions.space('vertical'))}
      >
        <VerticalSpace />
      </ButtonIcon>
    </div>
  );
}

export default PanelToolbar;
