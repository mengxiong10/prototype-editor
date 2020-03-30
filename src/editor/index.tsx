import React, { useReducer } from 'react';
import { EditorProvider } from './Context';
import PanelComponentList from './PanelComponentList';
import PanelStage from './PanelStage';
import PanelDetailWrapper from './PanelDetailWrapper';
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
          <div className="pe-component-list">
            <PanelComponentList />
          </div>
          <div className="pe-content">
            <PanelStage data={data} selected={selected} />
          </div>
          <div className="pe-detail-panel">
            <PanelDetailWrapper data={data} selected={selected} />
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}

export default Editor;
