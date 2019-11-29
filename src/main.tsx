import React from 'react';
import ReactDOM from 'react-dom';
import { message } from 'antd';
import App from './App';
import './style/index.scss';

message.config({
  duration: 2,
  maxCount: 3,
});

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
