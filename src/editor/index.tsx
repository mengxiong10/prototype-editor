import React, { useReducer } from 'react';
import { EditorAPIProvider } from './Context';
import ComponentList from './ComponentList';
import Stage from './Stage';
import DetailPanelWrapper from './DetailPanelWrapper';
import { reducer } from './reducer';

function Editor() {
  const [{ data, selected }, dispatch] = useReducer(reducer, {
    data: [],
    selected: [],
  });

  return (
    <EditorAPIProvider value={dispatch}>
      <div className="pe-container">
        <div className="pe-main">
          <ComponentList />
          <Stage data={data} selected={selected} />
          <DetailPanelWrapper data={data} selected={selected} />
        </div>
      </div>
    </EditorAPIProvider>
  );
}

export default Editor;
