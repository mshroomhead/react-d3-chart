import React, { Component } from 'react';

import { GlobalStyles } from '../styles/globalStyles';
import { ChartContextProvider } from './demo/ChartContext';
import { Demo } from './demo/Demo';

export class App extends Component {
  render() {
    return (
      <ChartContextProvider>
        <Demo />
        <GlobalStyles />
      </ChartContextProvider>
    );
  }
}
