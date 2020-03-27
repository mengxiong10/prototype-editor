import React, { useCallback } from 'react';
import ContextMenu from '@/components/ContextMenu';
import DrawRect, { RectData } from '@/components/DrawRect';
import { useEditor } from './Context';
import { ComponentData, ComponentId } from '@/types/editor';
import { useContextmenu } from './useContextMenu';
import { actions, createComponentData } from './reducer';
import { useDrop } from '@/hooks/useDrop';
import ComponentWrapper from './ComponentWrapper';

export interface PanelStage2Props {
  data: ComponentData[];
  selected: ComponentId[];
}

function PanelStage2({ data, selected }: PanelStage2Props) {
  const dispatch = useEditor();

  const contextmenu = useContextmenu({ data, selected });

  const dropProps = useDrop({
    onDropDone: ({ data: type, x, y }) => {
      const componentdata = createComponentData(type, x - 20, y - 20);
      dispatch(actions.add(componentdata));
    },
  });

  const handleSelect = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        // TODO: 没有第二个参数 推断是unknow, 需要修复成void
        dispatch(actions.selectClear(undefined));
      } else {
        const wrapper = (evt.target as Element).closest('.pe-component-wrapper');
        const id = (wrapper as HTMLDivElement).dataset.id!;
        dispatch(actions.select(id));
      }
    },
    [dispatch]
  );

  const handleDragSelect = (value: RectData) => {
    dispatch(actions.selectArea(value));
  };

  return (
    <div className="pe-content">
      <ContextMenu handle=".ant-dropdown-menu-item" {...contextmenu}>
        <DrawRect onMove={handleDragSelect}>
          <div
            style={{ minWidth: '100%', minHeight: '100%', width: '2000px', height: '1000px' }}
            tabIndex={-1}
            onMouseDown={handleSelect}
            {...dropProps}
          >
            {data.map(item => (
              <ComponentWrapper
                className="pe-component-wrapper"
                data={item}
                data-id={item.id}
                key={item.id}
                active={selected.indexOf(item.id) !== -1}
              />
            ))}
          </div>
        </DrawRect>
      </ContextMenu>
    </div>
  );
}

export default PanelStage2;
