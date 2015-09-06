import React from 'react';
import HBApp from './components/HBApp.jsx';
import MessagesExampleData from './MessagesExampleData.js';

MessagesExampleData.init();

React.render(
  <HBApp />,
  document.getElementById('hbapp')
);
