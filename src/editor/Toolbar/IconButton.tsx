import React from 'react';
import { Tooltip, Button } from 'antd';
import type { ButtonProps } from 'antd/lib/button';

export interface ButtonIconProps extends Omit<ButtonProps, 'title'> {
  title: React.ReactNode;
}

function IconButton({ title, ...rest }: ButtonIconProps) {
  return (
    <Tooltip title={title}>
      <Button
        size="small"
        style={{ height: '100%', border: 'none', background: 'none' }}
        {...rest}
      />
    </Tooltip>
  );
}

export default IconButton;
