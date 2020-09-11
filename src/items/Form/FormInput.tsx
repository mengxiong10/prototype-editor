import React, { useContext } from 'react';
import RowFlex from 'src/components/RowFlex';
import type { ComponentOptions } from 'src/editor/type';
import styles from './FormInput.module.scss';
import { FormGroupLabelContext } from './FormGroup';

export interface FormInputProps {
  title: string;
  value: string;
  placeholder: string;
}

function FormInput({ title, value, placeholder }: FormInputProps) {
  const labelWidth = useContext(FormGroupLabelContext);

  return (
    <RowFlex>
      <span style={{ width: labelWidth }}>{title}</span>
      <input
        style={{ flex: 1 }}
        readOnly
        className={styles.input}
        type="text"
        value={value}
        placeholder={placeholder}
      />
    </RowFlex>
  );
}

export const formInputOptions: ComponentOptions<FormInputProps> = {
  component: FormInput,
  defaultData: {
    title: '字段',
    value: '',
    placeholder: '',
  },
  detailPanel: [
    {
      title: '组件属性',
      list: [
        { title: '标题', prop: 'title', type: 'input' },
        { title: '默认值', prop: 'value', type: 'input' },
        { title: '提示文字', prop: 'placeholder', type: 'input' },
      ],
    },
  ],
};
