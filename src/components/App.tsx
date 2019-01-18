import React, { Component } from 'react';

import { GlobalStyles } from '../styles/globalStyles';
import { Demo } from './Demo';

export class App extends Component {
  render() {
    return (
      <>
        <Demo />
        <GlobalStyles />
      </>
    );
  }
}
