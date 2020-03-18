import React from 'react';

export interface NotFoundProps {
  type: string;
}

function NotFound({ type }: NotFoundProps) {
  return (
    <div style={{ color: 'red', textAlign: 'center', padding: 10 }}>
      {`type="${type}"组件未找到`}
    </div>
  );
}

export default NotFound;
