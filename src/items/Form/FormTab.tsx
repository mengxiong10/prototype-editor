import React from 'react';
import type { ComponentOptions, CompositeData } from 'src/editor';
import type { FormGroupProps } from './FormGroup';

export interface FormTabProps {
  title: string;
  children: CompositeData<FormGroupProps>[];
}

function FormTab({ title }: FormTabProps) {
  return <span>{title}</span>;
}

export const formTabOptions: ComponentOptions<FormTabProps> = {
  component: FormTab,
  defaultData: {
    title: '标签页',
  },
  children: ['r-form.group'],
  detailPanel: [
    {
      title: '组件属性',
      list: [{ title: '标题', prop: 'title', type: 'input' }],
    },
  ],
};
