import { extent } from 'd3-array';
import * as React from 'react';
import { Suspense, useContext } from 'react';
import styled from 'styled-components/macro';
import { DomainTime } from '../d3Chart/models';
import { zoomIn, zoomOut } from '../d3Chart/utils';
import { Chart } from './Chart';
import { ChartContext } from './ChartContext';
import { createResource } from './simpleCache';
import { Spinner } from './Spinner';

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

export function Demo() {
  return (
    <StyledDemo>
      <Title>Composable D3 chart</Title>
      <ChartBackground>
        <Suspense fallback={<Spinner />}>
          <ChartWithData />
        </Suspense>
      </ChartBackground>
      <ChartButtons />
    </StyledDemo>
  );
}

function ChartWithData() {
  const { state, actions } = useContext(ChartContext);
  const { xDomain } = state;
  const { changeXDomain } = actions;

  const data = createResource<Datum[]>(
    fetch('https://api.iextrading.com/1.0/stock/aapl/chart'),
    'data'
  );

  if (!xDomain) {
    changeXDomain(extent(data, xAccessor) as DomainTime);
    return null;
  }

  return <Chart data={data} />;
}
function ChartButtons() {
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
const StyledDemo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h3`
  color: #a9b7c6;
`;

const ChartBackground = styled.div`
  padding: 8px;
  position: relative;
  height: 300px;
  margin: 32px;
  align-self: stretch;
  background-color: white;
`;

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

// const fetchData = async () => {
//   throw await fetch('https://api.iextrading.com/1.0/stock/aapl/chart')
//     .then(res => res.json())
//     .then(data => {
//       setData(data);
//       changeXDomain(extent(data, xAccessor) as DomainTime);
//     });
// };
//
// useEffect(() => {
//   fetchData();
// }, []);
