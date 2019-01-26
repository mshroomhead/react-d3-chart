import { default as React, useContext } from 'react';
import styled from 'styled-components/macro';
import { zoomIn, zoomOut } from '../../d3Chart/utils';
import { ChartContext } from '../statefull/ChartContext';

export function ChartButtons() {
  const { state, actions } = useContext(ChartContext);
  const { xDomain } = state;
  const { changeXDomain, toggleColor } = actions;

  return (
    <div>
      <Button onClick={() => changeXDomain(zoomIn(xDomain!), true)}>+</Button>
      <Button onClick={() => changeXDomain(zoomOut(xDomain!), true)}>-</Button>
      <Button onClick={() => toggleColor()}>Toggle color</Button>
      <Button onClick={() => window.location.reload()}>Reload</Button>
    </div>
  );
}

// ----==== Styles ====---- //
const Button = styled.button`
  margin: 0 8px;
  padding: 8px 16px;
  color: #a9b7c6;
  font-weight: bold;
  font-size: 16px;
  background-color: #3c3f41;
  border: none;
  border-radius: 999px;
  &:focus {
    outline: none;
  }
`;
