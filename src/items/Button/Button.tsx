import React from 'react';
import { Editable } from 'src/editor';

export interface ButtonProps {
  backgroundColor: string;
  borderWidth: string | number;
  borderColor: string;
  color: string;
  circle: boolean;
  textContent: string;
  disabled: boolean;
}

function Button(props: ButtonProps) {
  const { disabled, circle, textContent, ...style } = props;

  // TODO: disabled 在编辑模式的时候不要设置, 设置之后不能响应点击事件
  return (
    <Editable prop="textContent">
      <button
        className="ant-btn"
        type="button"
        disabled={disabled}
        style={{ ...style, borderRadius: circle ? '50%' : undefined }}>
        <span>{textContent}</span>
      </button>
    </Editable>
  );
}

export default Button;
