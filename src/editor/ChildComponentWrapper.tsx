import React from 'react';

export const childComponentClassName = 'js-child-component';

export interface ChildComponentWrapperProps {
  path: string;
  type: string;
  children: React.ReactNode;
}

function ChildComponentWrapper({ path, type, children }: ChildComponentWrapperProps) {
  return (
    <div className={childComponentClassName} data-path={path} data-type={type}>
      {children}
    </div>
  );
}

export default ChildComponentWrapper;
