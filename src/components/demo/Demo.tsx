import * as React from 'react';
import { Suspense } from 'react';
import styled from 'styled-components/macro';
import { ChartButtons } from './components/ChartButtons';
import { ChartWithData } from './components/ChartWithData';
import { ChartWithData2 } from './components/ChartWithData2';
import { Spinner } from './components/Spinner';

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
          <ChartWithData2 />
        </Suspense>
      </ChartBackground>
      <ChartButtons />
    </StyledDemo>
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
