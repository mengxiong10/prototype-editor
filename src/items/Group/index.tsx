import React from 'react';
import CompositeWrapper from 'src/editor/CompositeWrapper';
import type { ComponentOptions } from 'src/types/editor';
import Button, { ButtonProps } from '../Button/Button';
import Input, { InputProps } from '../Input/Input';
import { inputOptions } from '../Input';
import { buttonOptions } from '../Button';

export interface GroupProps {
  button: ButtonProps;
  input: InputProps;
  title: string;
}

function Group(props: GroupProps) {
  return (
    <div>
      <div>{props.title}</div>
      <CompositeWrapper path="button" type="button">
        <Button {...props.button} />
      </CompositeWrapper>
      <CompositeWrapper path="input" type="input">
        <Input {...props.input} />
      </CompositeWrapper>
    </div>
  );
}

export const groupOptions: ComponentOptions<GroupProps> = {
  component: Group,
  defaultSize: {
    width: 200,
    height: 100,
  },
  defaultData: {
    title: '复合组件',
    button: buttonOptions.defaultData,
    input: inputOptions.defaultData,
  },
  detailPanel: [
    {
      title: '外观',
      list: [{ title: '文字内容', prop: 'title', type: 'input' }],
    },
  ],
};
