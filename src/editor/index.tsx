import React, { useReducer } from 'react';
import { EditorProvider } from './Context';
import PanelComponentList from './PanelComponentList';
import PanelStage from './PanelStage';
import PanelDrawing from './PanelDrawing';
import PanelDetailWrapper from './PanelDetailWrapper';
import PanelToolbar from './PanelToolbar';
import { reducer } from './reducer';

const initialState = {
  data: [],
  selected: [],
};

function Editor() {
  const [{ data, selected }, dispatch] = useReducer(reducer, initialState);

  return (
    <EditorProvider value={dispatch}>
      <aside className="pe-left-sider">
        <PanelComponentList />
      </aside>
      <main className="pe-main">
        <PanelToolbar />
        <div className="pe-content u-scroll">
          <PanelStage data={data} selected={selected} />
          <PanelDrawing />
        </div>
      </main>
      <aside className="pe-right-sider">
        <PanelDetailWrapper data={data} selected={selected} />
      </aside>
    </EditorProvider>
  );
}

export default Editor;
