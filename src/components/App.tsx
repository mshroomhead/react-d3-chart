import React, { Component } from 'react';

import { GlobalStyles } from '../styles/globalStyles';
import { ChartContextProvider as ChartContextProvider2 } from './demo/statefull/ChartContext2';
import { ChartContextProvider } from './demo/statefull/ChartContext';
import { Demo } from './demo/Demo';

export class App extends Component {
  render() {
    return (
      <ChartContextProvider>
        <ChartContextProvider2>
          <Demo />
          <GlobalStyles />
        </ChartContextProvider2>
      </ChartContextProvider>
    );
  }
}
