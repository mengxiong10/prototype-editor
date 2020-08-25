import React, { useReducer } from 'react';
import { EditorContext } from './Context';
import Toolbar from './Toolbar';
import DetailPanel from './DetailPanel';
import ItemPanel from './ItemPanel';
import Stage from './Stage';
import { reducer, Store } from './reducer';

const initialState: Store = {
  data: {
    past: [],
    present: [],
    future: [],
  },
  selected: [],
};

function Editor() {
  const [{ data, selected }, dispatch] = useReducer(reducer, initialState);

  return (
    <EditorContext.Provider value={dispatch}>
      <aside className="pe-left-sider">
        <ItemPanel />
      </aside>
      <main className="pe-main">
        <Toolbar data={data} selected={selected} />
        <div className="pe-content u-scroll">
          <Stage data={data} selected={selected} />
        </div>
      </main>
      <aside className="pe-right-sider">
        <DetailPanel data={data.present} selected={selected} />
      </aside>
    </EditorContext.Provider>
  );
}

export default Editor;
