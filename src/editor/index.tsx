import React, { useReducer } from 'react';
import { EditorProvider } from './Context';
import ComponentList from './ComponentList';
import Stage from './Stage';
import DetailPanelWrapper from './DetailPanelWrapper';
import { reducer } from './reducer';
import ComponentWrapper from './ComponentWrapper';

const initialState = {
  data: [],
  selected: [],
};

function Editor() {
  const [{ data, selected }, dispatch] = useReducer(reducer, initialState);

  return (
    <EditorProvider value={dispatch}>
      <div className="pe-container">
        <div className="pe-main">
          <ComponentList />
          <Stage data={data} selected={selected}>
            {data.map(item => (
              <ComponentWrapper
                className="pe-component-wrapper"
                data={item}
                data-id={item.id}
                key={item.id}
                active={selected.indexOf(item.id) !== -1}
              />
            ))}
          </Stage>
          <DetailPanelWrapper data={data} selected={selected} />
        </div>
      </div>
    </EditorProvider>
  );
}

export default Editor;
