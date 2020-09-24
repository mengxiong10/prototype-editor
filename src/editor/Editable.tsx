import React, { useCallback, useEffect, useState } from 'react';
import pick from 'object.pick';
import { useComponentId, useCompositePath } from './Context';
import { EventEditable } from './event';

export interface EditableProps {
  children: React.ReactElement;
  prop: string;
}

function Editable({ children, prop }: EditableProps) {
  const prefixPath = useCompositePath();
  const cid = useComponentId();
  const [hidden, setHidden] = useState(false);

  const path = `${prefixPath}.data.${prop}`.replace(/^\./, '');

  useEffect(() => {
    return EventEditable.on((obj) => {
      setHidden(obj !== null && obj.id === cid && obj.path === path);
    });
  }, [cid, path]);

  const onDoubleClick = useCallback(
    (evt: React.MouseEvent) => {
      const { currentTarget } = evt;
      const text = currentTarget.textContent || '';
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const style = window.getComputedStyle(currentTarget, null);
      const textStyle: any = pick(style, [
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
        style: {
          ...textStyle,
          left,
          top,
          width,
          height,
        },
        id: cid,
        path,
      });
    },
    [cid, path]
  );

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
