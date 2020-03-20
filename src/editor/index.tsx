import React, { useReducer } from 'react';
import { EditorProvider } from './Context';
import ComponentList from './ComponentList';
import Stage from './Stage';
import DetailPanelWrapper from './DetailPanelWrapper';
import { reducer } from './reducer';

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
          <Stage data={data} selected={selected} />
          <DetailPanelWrapper data={data} selected={selected} />
        </div>
      </div>
    </EditorProvider>
  );
}

export default Editor;
