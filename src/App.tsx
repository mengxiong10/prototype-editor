import { ConfigProvider } from 'antd';
import zh from 'antd/lib/locale-provider/zh_CN';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import Editor from './editor/Editor';
import Page from './editor/Page';
import DetailPanel from './editor/DetailPanel';
import ComponentList from './editor/ComponentList';
import Toolbar from './editor/Toolbar';
import './items/index';
import './commands/index';

const getPopupContainer = (dom?: HTMLElement) => {
  return ((dom && dom.closest('.ant-modal')) || document.body) as HTMLElement;
};

const App = () => {
  return (
    <ConfigProvider locale={zh} getPopupContainer={getPopupContainer}>
      <Editor>
        <div className="pe-container">
          <Toolbar />
          <div className="pe-main">
            <ComponentList />
            <Page />
            <DetailPanel />
          </div>
        </div>
      </Editor>
    </ConfigProvider>
  );
};

export default hot(App);
