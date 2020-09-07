import React, { useReducer } from 'react';
import { EditorContext } from './Context';
import Toolbar from './Toolbar';
import DetailPanel from './DetailPanel';
import ItemPanel from './ItemPanel';
import Stage from './Stage';
import { reducer } from './reducer';
import type { Store } from './reducer/type';

const initialState: Store = {
  data: {
    past: [],
    present: [],
    future: [],
  },
  selected: [],
  clipboard: [],
  scale: 1,
};

function Editor() {
  const [store, dispatch] = useReducer(reducer, initialState);

  const { data, selected, clipboard, scale } = store;

  return (
    <EditorContext.Provider value={dispatch}>
      <aside className="pe-left-sider">
        <ItemPanel />
      </aside>
      <main className="pe-main">
        <Toolbar data={data} selected={selected} scale={scale} />
        <div className="pe-content u-scroll">
          <Stage data={data} selected={selected} clipboard={clipboard} scale={scale} />
        </div>
      </main>
      <aside className="pe-right-sider">
        <DetailPanel data={data.present} selected={selected} />
      </aside>
    </EditorContext.Provider>
  );
}

export default Editor;
