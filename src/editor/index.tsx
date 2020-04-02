import React, { useReducer } from 'react';
import { Layout } from 'antd';
import { EditorProvider } from './Context';
import PanelComponentList from './PanelComponentList';
import PanelStage from './PanelStage';
import PanelDrawer from './PanelDrawer';
import PanelDetailWrapper from './PanelDetailWrapper';
import PanelToolbar from './PanelToolbar';
import { reducer } from './reducer';

const { Sider, Content } = Layout;

const initialState = {
  data: [],
  selected: [],
};

function Editor() {
  const [{ data, selected }, dispatch] = useReducer(reducer, initialState);

  return (
    <EditorProvider value={dispatch}>
      <Layout style={{ height: '100%' }}>
        <Sider style={{ borderRight: '1px solid #e8e8e8' }}>
          <PanelComponentList />
        </Sider>
        <Layout>
          <PanelToolbar />
          <Layout>
            <Content className="u-scroll" style={{ position: 'relative', overflow: 'auto' }}>
              <PanelStage data={data} selected={selected} />
              <PanelDrawer />
            </Content>
            <Sider width={240} style={{ borderLeft: '1px solid #e8e8e8' }}>
              <PanelDetailWrapper data={data} selected={selected} />
            </Sider>
          </Layout>
        </Layout>
      </Layout>
    </EditorProvider>
  );
}

export default Editor;
