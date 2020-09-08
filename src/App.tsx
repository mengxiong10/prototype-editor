import { ConfigProvider } from 'antd';
import zh from 'antd/lib/locale-provider/zh_CN';
import React from 'react';
import Editor from './editor';
import './items';

const getPopupContainer = (dom?: HTMLElement) => {
  return ((dom && dom.closest('.ant-modal')) || document.body) as HTMLElement;
};

const App = () => {
  return (
    <ConfigProvider locale={zh} getPopupContainer={getPopupContainer}>
      <Editor />
    </ConfigProvider>
  );
};

export default App;
