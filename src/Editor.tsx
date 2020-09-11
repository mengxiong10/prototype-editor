import React, { useCallback, useReducer } from 'react';
import { itemPanelGroup } from 'src/items/index';
import {
  EditorContext,
  EditorExecCommand,
  Toolbar,
  DetailPanel,
  ItemPanel,
  Stage,
  EditorContextMenu,
  reducer,
  actions,
  Store,
} from 'src/editor';

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
        <ItemPanel data={itemPanelGroup} />
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
