import React from 'react';
import DropZone from './DropZone';
import { useEditorData, useEditorAPI } from './EditorContext';
import { getComponent } from './component';
import ComponentWrapper from './ComponentWrapper';

function Page() {
  const { data } = useEditorData();
  const { addComponent } = useEditorAPI();

  return (
    <DropZone className="pe-content" onDropDone={addComponent}>
      {data.map(item => {
        const component = getComponent(item.type);
        if (!component) return null;
        return (
          <ComponentWrapper key={item.id} id={item.id} {...item.position} {...item.size}>
            {React.createElement(component.component, {
              ...component.defaultData,
              ...item.data,
            })}
          </ComponentWrapper>
        );
      })}
    </DropZone>
  );
}

export default Page;
