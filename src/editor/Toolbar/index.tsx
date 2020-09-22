import React from 'react';
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import BorderOutlined from '@ant-design/icons/BorderOutlined';
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
import { EventDrawing } from 'src/editor/event';
import { useEditor } from 'src/editor/Context';
import type { Store } from 'src/editor/type';
import { InputNumber } from 'antd';
import IconButton from './IconButton';

export type PanelToolbarProps = Pick<Store, 'data' | 'selected' | 'scale'>;

function Toolbar({ data, selected, scale }: PanelToolbarProps) {
  const execCommand = useEditor();

  const divider = (
    <div style={{ height: '60%', width: 1, background: '#e8e8e8', margin: '0 8px' }}></div>
  );

  return (
    <div className="pe-toolbar">
      <IconButton
        title="撤销(ctrl+z)"
        disabled={data.past.length === 0}
        onClick={() => execCommand('undo')}>
        <Undo />
      </IconButton>
      <IconButton
        title="重做(ctrl+shift+z)"
        disabled={data.future.length === 0}
        onClick={() => execCommand('redo')}>
        <Redo />
      </IconButton>
      {divider}
      <IconButton title="重点标记" onClick={() => EventDrawing.emit('rect')}>
        <BorderOutlined />
        <span style={{ marginLeft: 4 }}>方框</span>
      </IconButton>
      {divider}
      <IconButton title="添加批注" onClick={() => EventDrawing.emit('comment')}>
        <CommentOutlined />
        <span style={{ marginLeft: 4 }}>标注</span>
      </IconButton>
      {divider}
      <IconButton
        title="左对齐"
        disabled={selected.length < 2}
        onClick={() => execCommand('alignLeft')}>
        <AlignLeft />
      </IconButton>
      <IconButton
        title="水平居中"
        disabled={selected.length < 2}
        onClick={() => execCommand('alignHorizontal')}>
        <AlignCenter />
      </IconButton>
      <IconButton
        title="右对齐"
        disabled={selected.length < 2}
        onClick={() => execCommand('alignRight')}>
        <AlignRight />
      </IconButton>
      <IconButton
        title="顶对齐"
        disabled={selected.length < 2}
        onClick={() => execCommand('alignTop')}>
        <AlignTop />
      </IconButton>
      <IconButton
        title="垂直居中"
        disabled={selected.length < 2}
        onClick={() => execCommand('alignVertical')}>
        <AlignVerticel />
      </IconButton>
      <IconButton
        title="底对齐"
        disabled={selected.length < 2}
        onClick={() => execCommand('alignBottom')}>
        <AlignBottom />
      </IconButton>
      <IconButton
        title="水平等间距"
        disabled={selected.length < 3}
        onClick={() => execCommand('spaceHorizontal')}>
        <HorizontalSpace />
      </IconButton>
      <IconButton
        title="垂直等间距"
        disabled={selected.length < 3}
        onClick={() => execCommand('spaceVertical')}>
        <VerticalSpace />
      </IconButton>
      <span style={{ flex: 1 }}></span>
      <InputNumber
        size="small"
        style={{ width: 70 }}
        value={Math.floor(scale * 100)}
        min={50}
        max={150}
        step={10}
        formatter={(value) => `${value}%`}
        parser={(value: string) => value.replace('%', '')}
        onChange={(value: number) => {
          if (value < 50 || value > 150) {
            return;
          }
          execCommand('scale', value / 100);
        }}
      />
    </div>
  );
}

export default Toolbar;
