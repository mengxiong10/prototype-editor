import React from 'react';
import classNames from 'classnames';
import './Button.module.scss';

export interface ButtonProps {
  disabled: boolean;
  backgroundColor: string;
  borderWidth: string | number;
  borderColor: string;
  color: string;
  textAlign: 'left' | 'right' | 'center';
  textContent: string;
  fontWeight: 'normal' | 'bold';
  circle: boolean;
}

function Button({
  circle,
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
  const className = classNames('button', {
    'button-circle': circle,
  });

  return (
    <button styleName={className} type="button" disabled={disabled} style={style}>
      {textContent}
    </button>
  );
}

export default Button;
