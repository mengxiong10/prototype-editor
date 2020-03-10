import React from 'react';

export interface ButtonProps {
  disabled: boolean;
  backgroundColor: string;
  borderWidth: string | number;
  borderColor: string;
  color: string;
  textAlign: 'left' | 'right' | 'center';
  textContent: string;
  fontWeight: 'normal' | 'bold';
}

function Button({
  backgroundColor,
  borderColor,
  borderWidth,
  color,
  textAlign,
  textContent,
  fontWeight,
  disabled,
}: ButtonProps) {
  const style = {
    backgroundColor,
    borderColor,
    borderWidth,
    color,
    textAlign,
    fontWeight,
  };

  return (
    <button type="button" disabled={disabled} style={style}>
      {textContent}
    </button>
  );
}

export default Button;
