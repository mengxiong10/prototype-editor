import React from 'react';
import OrderedListOutlined from '@ant-design/icons/OrderedListOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';
import BoldOutlined from '@ant-design/icons/BoldOutlined';
import ItalicOutlined from '@ant-design/icons/ItalicOutlined';
import UnderlineOutlined from '@ant-design/icons/UnderlineOutlined';
import type { EditorState } from 'draft-js';

const BLOCK_TYPES = [
  { label: <OrderedListOutlined />, style: 'ordered-list-item' },
  { label: <UnorderedListOutlined />, style: 'unordered-list-item' },
];

const INLINE_STYLES = [
  { label: <BoldOutlined />, style: 'BOLD' },
  { label: <ItalicOutlined />, style: 'ITALIC' },
  { label: <UnderlineOutlined />, style: 'UNDERLINE' },
];

interface StyleButtonProps {
  label: React.ReactNode;
  style: string;
  onToggle: (style: string) => void;
  active: boolean;
}

const StyleButton = (props: StyleButtonProps) => {
  const handleMouseDown = (evt: React.MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    props.onToggle(props.style);
  };

  return (
    <span
      style={{
        padding: '2px 0',
        display: 'inline-block',
        cursor: 'pointer',
        marginRight: 10,
        color: props.active ? '#108ee9' : '#333',
      }}
      onMouseDown={handleMouseDown}
    >
      {props.label}
    </span>
  );
};

interface StyleControlsProps {
  editorState: EditorState;
  onToggle: (style: string) => void;
}

export const BlockStyleControls = (props: StyleControlsProps) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.style}
          active={type.style === blockType}
          onToggle={props.onToggle}
          {...type}
        />
      ))}
    </div>
  );
};

export const InlineStyleControls = (props: StyleControlsProps) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.style}
          active={currentStyle.has(type.style)}
          onToggle={props.onToggle}
          {...type}
        />
      ))}
    </div>
  );
};
