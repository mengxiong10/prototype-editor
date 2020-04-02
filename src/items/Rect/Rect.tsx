import React from 'react';

export interface RectProps {
  stroke: string;
  strokeWidth: number;
}

function Rect({ stroke, strokeWidth }: RectProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" pointerEvents="none" style={{ overflow: 'visible' }}>
      <rect
        width="100%"
        height="100%"
        rx="5"
        ry="5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="transparent"
        pointerEvents="stroke"
      />
      <rect
        width="100%"
        height="100%"
        rx="5"
        ry="5"
        stroke="transparent"
        strokeWidth="10"
        fill="transparent"
        pointerEvents="stroke"
      />
    </svg>
  );
}

export default Rect;
