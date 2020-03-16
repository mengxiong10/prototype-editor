import React from 'react';
import { Popover } from 'antd';
import { SketchPicker, SketchPickerProps } from 'react-color';

export interface ColorPickerProps extends SketchPickerProps {
  color: string;
}

function ColorPicker({ color, ...rest }: ColorPickerProps) {
  const Color = <SketchPicker color={color} {...rest} />;

  return (
    <Popover content={Color}>
      <div
        style={{
          padding: 5,
          background: '#fff',
          borderRadius: 1,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 36,
            height: 14,
            borderRadius: 2,
            background: color,
          }}
        ></div>
      </div>
    </Popover>
  );
}

export default ColorPicker;
