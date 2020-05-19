import React from 'react';

export interface TextAreaProps {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  color: string;
  placeholder: string;
  value: string;
}

function TextArea(props: TextAreaProps) {
  const { value, placeholder, ...style } = props;

  return (
    <textarea
      className="ant-input"
      style={style}
      readOnly
      value={value}
      placeholder={placeholder}
    />
  );
}

export default TextArea;
