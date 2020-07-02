import React from 'react';
import { Input, Switch, InputNumber } from 'antd';
import ColorPicker from '../components/ColorPicker';
import type { PanelChangeHandler } from './PanelDetail';

const { TextArea } = Input;

export interface DetailPanelRowProps extends Object {
  title: string;
  prop: string;
  value: any;
  onChange: PanelChangeHandler;
}

export const RowInput = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <div className="pe-detail-panel-row">
      <span>{title}</span>
      <Input
        style={{ width: 120 }}
        value={value}
        onChange={(evt) => onChange({ prop, value: evt.target.value, history: false })}
      />
    </div>
  );
};

export const RowTextArea = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <div className="pe-detail-panel-row">
      <span>{title}</span>
      <TextArea
        style={{ width: 120 }}
        value={value}
        onChange={(evt) => onChange({ prop, value: evt.target.value, history: false })}
      />
    </div>
  );
};

export const RowColor = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <div className="pe-detail-panel-row">
      <span>{title}</span>
      <ColorPicker
        color={value}
        onChangeComplete={(color) => onChange({ prop, value: color.hex })}
      />
    </div>
  );
};

export const RowSwitch = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <div className="pe-detail-panel-row">
      <span>{title}</span>
      <Switch checked={value} onChange={(v) => onChange({ prop, value: v })} />
    </div>
  );
};

export const RowNumber = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <div className="pe-detail-panel-row">
      <span>{title}</span>
      <InputNumber
        style={{ width: 80 }}
        min={0}
        max={10}
        value={value}
        onChange={(v) => onChange({ prop, value: v, history: false })}
      />
    </div>
  );
};

export const itemMap = {
  input: RowInput,
  textarea: RowTextArea,
  color: RowColor,
  switch: RowSwitch,
  number: RowNumber,
};
