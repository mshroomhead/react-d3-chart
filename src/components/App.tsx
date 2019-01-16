import React, { Component } from 'react';
import styled from 'styled-components/macro';

import { GlobalStyles } from '../styles/globalStyles';

export class App extends Component {
  render() {
    return (
      <StyledApp>
        App
        <GlobalStyles />
      </StyledApp>
    );
  }
}

const StyledApp = styled.div``;
