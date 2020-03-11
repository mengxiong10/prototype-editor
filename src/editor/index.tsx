import React, { useReducer, useState } from 'react';
import { EditorAPIProvider } from './Context';
import ComponentList from './ComponentList';
import Stage from './Stage';
import DetailPanelWrapper from './DetailPanelWrapper';
import { reducer } from './reducer';

function Editor() {
  const [data, dispatch] = useReducer(reducer, []);
  // 多选 用逗号分割
  const [selected, setSelected] = useState<string>('');

  return (
    <EditorAPIProvider value={dispatch}>
      <div className="pe-container">
        <div className="pe-main">
          <ComponentList />
          <Stage data={data} selected={selected} onSelect={setSelected} />
          <DetailPanelWrapper data={data} selected={selected} />
        </div>
      </div>
    </EditorAPIProvider>
  );
}

export default Editor;
