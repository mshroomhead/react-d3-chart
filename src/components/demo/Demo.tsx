import { extent } from 'd3-array';
import * as React from 'react';
import { Suspense, useState } from 'react';
import styled from 'styled-components/macro';
import { ChartState } from '../d3Chart/components/ChartState';
import { DomainLinear, DomainTime } from '../d3Chart/models';
import { zoomIn, zoomOut } from '../d3Chart/utils';
import { DemoChart } from './DemoChart';
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

interface DomainState {
  xDomain: DomainTime | null;
  animate: boolean;
}

export function Demo() {
  const [color, setColor] = useState('#0088cc');

  return (
    <ChartState initialYDomain={[100, 200]}>
      {({
        state: { xDomain, yDomain, animate },
        actions: { changeXDomain },
      }) => (
        <StyledDemo>
          <Title>Composable D3 chart</Title>
          <Chart>
            <Suspense fallback={<Spinner />}>
              <DemoChartWithData
                color={color}
                animate={animate}
                xDomain={xDomain!}
                yDomain={yDomain!}
                changeXDomain={changeXDomain}
              />
            </Suspense>
          </Chart>
          <div>
            <Button onClick={() => changeXDomain(zoomIn(xDomain!), true)}>
              +
            </Button>
            <Button onClick={() => changeXDomain(zoomOut(xDomain!), true)}>
              -
            </Button>
            <Button onClick={() => setColor(toggleColor)}>Toggle color</Button>
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </div>
        </StyledDemo>
      )}
    </ChartState>
  );
}

interface DemoChartWithDataProps {
  color: string;
  xDomain: DomainTime;
  yDomain: DomainLinear;
  animate: boolean;
  changeXDomain(domain: DomainTime): void;
}

function DemoChartWithData(props: DemoChartWithDataProps) {
  const data = createResource<Datum[]>(
    fetch('https://api.iextrading.com/1.0/stock/aapl/chart'),
    'data'
  );

  if (!props.xDomain) {
    props.changeXDomain(extent(data, xAccessor) as DomainTime);
    return null;
  }

  return (
    <DemoChart {...props} data={data} xDomain={props.xDomain as DomainTime} />
  );
}

const toggleColor = (prevColor: string) =>
  prevColor === '#ef5b5b' ? '#0088cc' : '#ef5b5b';

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
