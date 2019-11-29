import React from 'react';
import { useEditorAPI } from './EditorContext';

export interface ComponentWrapperProps {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  children: React.ReactNode;
}

function ComponentWrapper(props: ComponentWrapperProps) {
  const { id, left, top, width, height, children } = props;

  const { selectComponent } = useEditorAPI();

  const handleSelect = () => {
    selectComponent(id);
  };

  return (
    <div
      onMouseDownCapture={handleSelect}
      className="pe-component-wrapper"
      style={{ left, top, width, height, position: 'absolute' }}
    >
      {children}
    </div>
  );
}

export default ComponentWrapper;
