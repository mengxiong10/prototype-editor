import React, { useReducer } from 'react';
import { EditorContext } from './Context';
import PanelComponentList from './PanelComponentList';
import PanelStage from './PanelStage';
import PanelDetailWrapper from './PanelDetailWrapper';
import PanelToolbar from './PanelToolbar';
import { reducer, Store } from './reducer';

const initialState: Store = {
  data: {
    past: [],
    present: [],
    future: [],
  },
  selected: [],
  status: {},
};

function Editor() {
  const [{ data, selected, status }, dispatch] = useReducer(reducer, initialState);

  return (
    <EditorContext.Provider value={dispatch}>
      <aside className="pe-left-sider">
        <PanelComponentList />
      </aside>
      <main className="pe-main">
        <PanelToolbar data={data} selected={selected} />
        <div className="pe-content u-scroll">
          <PanelStage data={data} selected={selected} status={status} />
        </div>
      </main>
      <aside className="pe-right-sider">
        <PanelDetailWrapper data={data.present} selected={selected} status={status} />
      </aside>
    </EditorContext.Provider>
  );
}

export default Editor;
