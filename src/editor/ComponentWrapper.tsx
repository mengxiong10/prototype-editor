import React from 'react';
import { ComponentRect } from '@/types/editor';
import DragResizable, { DragResizableData } from '@/components/DragResizable';
import { useEditor } from './Context';
import { actions } from './reducer';
import { getComponent } from './registerComponents';

export interface ComponentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  id: string;
  type: string;
  rect: ComponentRect;
  children: React.ReactNode;
}

function ComponentWrapper({ active, rect, id, children, type, className }: ComponentWrapperProps) {
  const dispatch = useEditor();

  // 同步数据到顶层
  const handleStop = (data: DragResizableData) => {
    dispatch(
      actions.update({
        id,
        rect: data,
      })
    );
  };
  // 选中组件
  const handleMouseDown = () => {
    dispatch(actions.select(id));
  };

  const style = getComponent(type).wrapperStyle;

  return (
    <DragResizable data={rect} resizable={active} onStop={handleStop} cancel=".js-drag-cancel">
      <div className={className} style={style} onMouseDown={handleMouseDown}>
        {children}
      </div>
    </DragResizable>
  );
}

export default React.memo(ComponentWrapper);
