import React from 'react';

export interface InputProps {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  color: string;
  placeholder: string;
  value: string;
}

function Input(props: InputProps) {
  const { value, placeholder, ...style } = props;

  return (
    <input className="ant-input" style={style} readOnly value={value} placeholder={placeholder} />
  );
}

export default Input;
