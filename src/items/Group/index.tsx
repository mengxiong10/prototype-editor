import React from 'react';
import type { ComponentOptions } from 'src/types/editor';
import { useEditor, useComponentId } from 'src/editor/Context';
import { actions } from 'src/editor/reducer';
import { detailChangeEvent } from 'src/editor/event';
import Button, { ButtonProps } from '../Button/Button';
import Input, { InputProps } from '../Input/Input';
import { inputOptions } from '../Input';
import { buttonOptions } from '../Button';

export interface GroupProps {
  button: ButtonProps;
  input: InputProps;
  title: string;
}

function Wrapper({
  path,
  type,
  children,
}: {
  path: string;
  type: string;
  children: React.ReactNode;
}) {
  const id = useComponentId();
  const dispatch = useEditor();

  const handleClick = (evt: React.MouseEvent) => {
    if (!evt.ctrlKey) {
      evt.stopPropagation();
      dispatch(actions.select(id));
      detailChangeEvent.emit({ path, type });
    }
  };

  return <span onMouseDown={handleClick}>{children}</span>;
}

function Group(props: GroupProps) {
  return (
    <div>
      <div>{props.title}</div>
      <Wrapper path="button" type="group.button">
        <Button {...props.button} />
      </Wrapper>
      <Wrapper path="input" type="group.input">
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
