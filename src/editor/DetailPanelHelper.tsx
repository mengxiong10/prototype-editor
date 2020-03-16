import React from 'react';
import { Input, Switch, Slider } from 'antd';
import ColorPicker from '../components/ColorPicker';

export interface DetailPanelRowProps extends Object {
  title: string;
  prop: string;
  value: any;
  onChange: (obj: any) => void;
}

export const RowInput = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <div className="pe-detail-panel-row">
      <span>{title}</span>
      <Input
        style={{ width: 100 }}
        value={value}
        onChange={evt => onChange({ [prop]: evt.target.value })}
      />
    </div>
  );
};

export const RowColor = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <div className="pe-detail-panel-row">
      <span>{title}</span>
      <ColorPicker color={value} onChangeComplete={color => onChange({ [prop]: color.hex })} />
    </div>
  );
};

export const RowSwitch = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <div className="pe-detail-panel-row">
      <span>{title}</span>
      <Switch checked={value} onChange={v => onChange({ [prop]: v })} />
    </div>
  );
};

export const RowSlider = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <div className="pe-detail-panel-row">
      <span>{title}</span>
      <Slider
        style={{ width: 100 }}
        min={0}
        max={10}
        onChange={v => onChange({ [prop]: v })}
        value={value}
      />
    </div>
  );
};

export const itemMap = {
  input: RowInput,
  color: RowColor,
  switch: RowSwitch,
  slider: RowSlider,
};
