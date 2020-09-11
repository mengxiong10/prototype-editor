import React from 'react';
import FileAddOutlined from '@ant-design/icons/FileAddOutlined';
import classNames from 'classnames';

export interface PanelItemProps {
  children: React.ReactNode;
  type: string;
  size?: 'default' | 'small';
}

function PanelItem({ type, children, size = 'default' }: PanelItemProps) {
  const handleDragStart = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.dataTransfer.setData('type', type);
  };

  return (
    <div
      className={classNames('pe-component-item', {
        'pe-component-item__small': size === 'small',
      })}
      draggable
      onDragStart={handleDragStart}
    >
      <FileAddOutlined style={size === 'small' ? { margin: '0 10px' } : { marginBottom: 5 }} />
      <span style={{ fontSize: 12 }}>{children}</span>
    </div>
  );
}

export default PanelItem;
