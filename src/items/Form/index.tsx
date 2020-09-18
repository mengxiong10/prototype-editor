import React from 'react';
import { CompositeWrapper, CompositeDropZone, ComponentOptions, CompositeData } from 'src/editor';
import type { FormSectionProps } from './FormSection';

export interface FormProps {
  title: string;
  children: CompositeData<FormSectionProps>[];
}

function Form({ title, children }: FormProps) {
  return (
    <CompositeDropZone drop="r-form">
      <h5>{title}</h5>
      {children.map((v, i) => (
        <CompositeWrapper {...v} key={v.id} index={i} />
      ))}
    </CompositeDropZone>
  );
}

export const formOptions: ComponentOptions<FormProps> = {
  component: Form,
  defaultSize: {
    width: 500,
    height: 300,
  },
  children: ['r-form-section'],
  defaultData: {
    title: '标题',
  },
  detailPanel: [
    {
      title: '外观',
      list: [{ title: '文字内容', prop: 'title', type: 'input' }],
    },
  ],
};
