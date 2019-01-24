import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components/macro';
import { DemoChart } from './DemoChart';

interface DemoState {
  data: Datum[] | null;
  color: string;
}

export interface Datum {
  date: string;
  minute: string;
  label: string;
  high: number;
  low: number;
  average: number;
  volume: number;
  notional: number;
  numberOfTrades: number;
  marktHigh: number;
  marketLow: number;
  marketAverage: number;
  marketVolume: number;
  marketNotional: number;
  marketNumberOfTrades: number;
  open: number;
  close: number;
  marktOpen: number;
  marketClose: number;
  changeOverTime: number;
  marketChangeOverTime: number;
}

export const xAccessor = (datum: Datum) => new Date(datum.date);
export const yAccessor = (datum: Datum) => datum.close;

export class Demo extends Component<{}, DemoState> {
  state = {
    data: null,
    color: '#0088cc',
  };

  async componentDidMount() {
    const response = await fetch(
      'https://api.iextrading.com/1.0/stock/aapl/chart'
    );
    const data = await response.json();
    this.setState({ data });
  }

  toggleColor = () =>
    this.setState(({ color }) => ({
      color: color === '#ef5b5b' ? '#0088cc' : '#ef5b5b',
    }));

  render() {
    const { data, color } = this.state;

    return (
      <StyledDemo>
        <Title>Composable D3 chart</Title>
        <Chart>{data && <DemoChart data={data} splineColor={color} />}</Chart>
        <button onClick={this.toggleColor}>Toggle color</button>
      </StyledDemo>
    );
  }
}

// ----==== Styles ====---- //
const StyledDemo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h3`
  color: #a9b7c6;
`;

const Chart = styled.div`
  height: 300px;
  margin: 32px;
  align-self: stretch;
  background-color: white;
`;
