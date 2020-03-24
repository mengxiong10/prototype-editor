import React, { useReducer } from 'react';
import { EditorProvider } from './Context';
import PanelComponentList from './PanelComponentList';
import PanelStage from './PanelStage';
import PanelDetailWrapper from './PanelDetailWrapper';
import { reducer } from './reducer';
import ComponentWrapper from './ComponentWrapper';

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
          <PanelComponentList />
          <PanelStage data={data} selected={selected}>
            {data.map(item => (
              <ComponentWrapper
                className="pe-component-wrapper"
                data={item}
                data-id={item.id}
                key={item.id}
                active={selected.indexOf(item.id) !== -1}
              />
            ))}
          </PanelStage>
          <PanelDetailWrapper data={data} selected={selected} />
        </div>
      </div>
    </EditorProvider>
  );
}

export default Editor;
