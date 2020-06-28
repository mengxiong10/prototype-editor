import React from 'react';
import Button, { ButtonProps } from '../Button/Button';
import Input, { InputProps } from '../Input/Input';
import { ComponentOptions } from '@/types/editor';

export interface GroupProps {
  button: ButtonProps;
  input: InputProps;
  title: string;
}

function Wrapper({ prop, children }: { prop: string; children: React.ReactNode }) {
  const handleClick = () => {
    console.log(prop);
  };

  return <span onClick={handleClick}>{children}</span>;
}

function Group(props: GroupProps) {
  return (
    <div>
      <div>{props.title}</div>
      <Wrapper prop="button">
        <Button {...props.button} />
      </Wrapper>
      <Wrapper prop="input">
        <Input {...props.input} />
      </Wrapper>
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
    button: {
      circle: false,
      backgroundColor: '#fff',
      borderColor: '#d9d9d9',
      borderWidth: 1,
      color: 'rgba(0, 0, 0, 0.65)',
      textContent: '按钮',
      disabled: false,
    },
    input: {
      backgroundColor: '#fff',
      borderColor: '#d9d9d9',
      color: 'rgba(0, 0, 0, 0.65)',
      borderWidth: 1,
      value: '',
      placeholder: 'input text',
    },
  },
  detailPanel: [
    {
      title: '外观',
      list: [{ title: '文字内容', prop: 'title', type: 'input' }],
    },
  ],
};
