import React, { useCallback, useReducer } from 'react';
import { EditorContext, EditorExecCommand } from './Context';
import Toolbar from './Toolbar';
import DetailPanel from './DetailPanel';
import ItemPanel from './ItemPanel';
import Stage from './Stage';
import EditorContextMenu from './EditorContextMenu';
import { reducer, actions } from './reducer';
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

  const execCommand: EditorExecCommand = useCallback(
    (command, ...params) => {
      dispatch((actions[command] as any)(...params));
    },
    [dispatch]
  );

  return (
    <EditorContext.Provider value={execCommand}>
      <aside className="pe-left-sider">
        <ItemPanel />
      </aside>
      <main className="pe-main">
        <Toolbar data={data} selected={selected} scale={scale} />
        <EditorContextMenu selected={selected} clipboard={clipboard}>
          <Stage data={data} selected={selected} scale={scale} />
        </EditorContextMenu>
      </main>
      <aside className="pe-right-sider">
        <DetailPanel data={data.present} selected={selected} />
      </aside>
    </EditorContext.Provider>
  );
}

export default Editor;
