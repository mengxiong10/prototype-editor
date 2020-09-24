import React, { useEffect, useRef, useState } from 'react';
import { useEditor } from './Context';
import { EditableParam, EventEditable } from './event';

export interface EditingTextAreaProps {
  scale?: number;
}

function EditingTextArea({ scale = 1 }: EditingTextAreaProps) {
  const execCommand = useEditor();
  const wrapper = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<EditableParam | null>(null);

  const handleConfirm = (evt: React.FocusEvent<HTMLDivElement>) => {
    if (!info) {
      return;
    }
    const value = evt.currentTarget.textContent;
    const { id, path } = info;
    execCommand('updateById', {
      id,
      path,
      value,
    });
    EventEditable.emit(null);
  };

  useEffect(() => {
    return EventEditable.on((obj) => {
      if (!wrapper.current) {
        return;
      }
      if (!obj) {
        setInfo(null);
        return;
      }
      const { left, top } = wrapper.current.getBoundingClientRect();
      obj.style.left -= left;
      obj.style.top -= top;
      setInfo(obj);
    });
  }, []);

  useEffect(() => {
    if (info && input.current) {
      input.current.focus();
      window.getSelection()!.selectAllChildren(input.current);
    }
  }, [info]);

  return (
    <div className="pe-editing-text-area" ref={wrapper}>
      {info && (
        <div
          ref={input}
          onBlur={handleConfirm}
          contentEditable
          suppressContentEditableWarning
          style={{
            position: 'absolute',
            outline: 'none',
            borderColor: 'transparent',
            ...info.style,
          }}>
          {info.children}
        </div>
      )}
    </div>
  );
}

export default EditingTextArea;
