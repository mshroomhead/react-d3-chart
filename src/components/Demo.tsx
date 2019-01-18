import * as React from 'react';
import styled from 'styled-components/macro';
import { D3Chart } from './D3Chart/D3Chart';
import { DomainLinear, DomainTime, Spacing } from './D3Chart/d3Chart.models';

interface Datum {
  x: Date;
  y: number;
}

const xAccessor = (datum: Datum) => datum.x;

const data: Datum[] = [
  { x: new Date('2019-01-01'), y: 0 },
  { x: new Date('2019-01-01'), y: 0 },
  { x: new Date('2019-01-01'), y: 0 },
];

const margin: Spacing = { top: 5, right: 5, bottom: 20, left: 25 };
const xDomain: DomainTime = [new Date('2019-01-01'), new Date('2019-02-01')];
const yDomain: DomainLinear = [0, 5];

export function Demo() {
  return (
    <StyledDemo>
      Composable D3 chart
      <Chart>
        <D3Chart
          margin={margin}
          xDomain={xDomain}
          yDomain={yDomain}
          xAccessor={xAccessor}
          data={data}
        >
          {d3ChartState => <circle />}
        </D3Chart>
      </Chart>
    </StyledDemo>
  );
}

// ----==== Styles ====---- //
const StyledDemo = styled.h3`
  text-align: center;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Chart = styled.div`
  background-color: white;
`;
