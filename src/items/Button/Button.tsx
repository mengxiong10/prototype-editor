import React from 'react';
import classNames from 'classnames';
import './Button.module.scss';

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
