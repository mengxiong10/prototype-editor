import React, { useEffect, useState } from 'react';
import pick from 'object.pick';
import { useComponentId, useCompositePath } from './Context';
import { EventEditable } from './event';

export interface EditableProps {
  children: React.ReactElement;
  prop: string;
  style?: React.CSSProperties;
}

function Editable({ children, prop, style }: EditableProps) {
  const prefixPath = useCompositePath();
  const cid = useComponentId();
  const [hidden, setHidden] = useState(false);

  const path = `${prefixPath}.data.${prop}`.replace(/^\./, '');

  useEffect(() => {
    return EventEditable.on((obj) => {
      setHidden(obj !== null && obj.id === cid && obj.path === path);
    });
  }, [cid, path]);

  const onDoubleClick = (evt: React.MouseEvent) => {
    const { currentTarget } = evt;
    const text = currentTarget.textContent || '';
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const currentStyle = window.getComputedStyle(currentTarget, null);
    const textStyle: any = pick(currentStyle, [
      'background',
      'font',
      'color',
      'lineHeight',
      'padding',
      'whiteSpace',
      'textAlign',
    ]);
    EventEditable.emit({
      children: text,
      rect: { left, top, width, height },
      style: { ...textStyle, ...style },
      id: cid,
      path,
    });
  };

  return React.cloneElement(children, {
    onDoubleClick,
    style: hidden
      ? {
          ...children.props.style,
          visibility: 'hidden',
        }
      : children.props.style,
  });
}

export default Editable;
