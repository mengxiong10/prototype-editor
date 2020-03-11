import React from 'react';
import { Input, Switch, Slider } from 'antd';
import { RowFlex } from 'my-react-common';
import { SketchPicker } from 'react-color';

export interface DetailPanelRowProps extends Object {
  title: string;
  prop: string;
  value: any;
  onChange: (obj: any) => void;
}

export const RowInput = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <RowFlex align="middle" justify="space-between">
      <span>{title}</span>
      <Input
        style={{ width: 150 }}
        value={value}
        onChange={evt => onChange({ [prop]: evt.target.value })}
      />
    </RowFlex>
  );
};

export const RowColor = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <RowFlex align="middle" justify="space-between">
      <span>{title}</span>
      <SketchPicker color={value} onChangeComplete={color => onChange({ [prop]: color.hex })} />
    </RowFlex>
  );
};

export const RowSwitch = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <RowFlex align="middle" justify="space-between">
      <span>{title}</span>
      <Switch checked={value} onChange={v => onChange({ [prop]: v })} />
    </RowFlex>
  );
};

export const RowSlider = ({ prop, title, value, onChange }: DetailPanelRowProps) => {
  return (
    <RowFlex>
      <span>{title}</span>
      <Slider min={0} max={10} onChange={v => onChange({ [prop]: v })} value={value} />
    </RowFlex>
  );
};

export const itemMap = {
  input: RowInput,
  color: RowColor,
  switch: RowSwitch,
  slider: RowSlider,
};
