import React from 'react';
import Button, { ButtonProps } from 'antd/lib/button';
import { useEditorAPI } from './EditorContext';

export interface CommandButtonProps extends ButtonProps {
  name: string;
  children: React.ReactNode;
}

function CommandButton(props: CommandButtonProps) {
  const { name, children, ...rest } = props;
  const { executeCommand } = useEditorAPI();

  const handleExecute = (evt: React.MouseEvent) => {
    evt.preventDefault();
    executeCommand(name);
  };

  return (
    <Button {...rest} onMouseDown={handleExecute}>
      {children}
    </Button>
  );
}

export default CommandButton;
