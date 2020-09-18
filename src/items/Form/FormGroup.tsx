import React from 'react';
import { CompositeWrapper, CompositeDropZone, ComponentOptions, CompositeData } from 'src/editor';

export interface FormGroupProps {
  title: string;
  labelWidth: number;
  children: CompositeData[];
}

export const FormGroupLabelContext = React.createContext(70);

function FormGroup({ title, children, labelWidth }: FormGroupProps) {
  return (
    <FormGroupLabelContext.Provider value={labelWidth}>
      <CompositeDropZone drop="r-form-group">
        <div>{title}</div>
        <div>
          {children.map((item, i) => (
            <CompositeWrapper {...item} key={item.id} index={i} />
          ))}
        </div>
      </CompositeDropZone>
    </FormGroupLabelContext.Provider>
  );
}

export const formGroupOptions: ComponentOptions<FormGroupProps> = {
  component: FormGroup,
  defaultData: {
    title: '分組',
    labelWidth: 70,
  },
  children: ['r-form-input'],
  detailPanel: [
    {
      title: '组件属性',
      list: [
        { title: '标题', prop: 'title', type: 'input' },
        { title: '字段寬度', prop: 'labelWidth', type: 'number' },
      ],
    },
  ],
};
