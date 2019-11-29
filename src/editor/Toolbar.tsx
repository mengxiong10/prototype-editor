import React from 'react';
import { Tooltip, Icon } from 'antd';
import CommandButton from './CommandButton';

function Toolbar() {
  return (
    <div className="pe-toolbar">
      <Tooltip title="加粗">
        <CommandButton name="bold">
          <Icon type="bold" />
        </CommandButton>
      </Tooltip>
    </div>
  );
}

export default Toolbar;
