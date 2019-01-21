import { extent } from 'd3-array';
import * as React from 'react';
import styled from 'styled-components/macro';

import { DomainLinear, DomainTime } from './D3Chart/d3Chart.models';
import { Datum, DemoChart } from './DemoChart';

const data: Datum[] = [
  { x: new Date('2019-01-01'), y: 2 },
  { x: new Date('2019-01-15'), y: 3 },
  { x: new Date('2019-02-01'), y: 4 },
];

const maxXDomain: DomainTime = extent(data, d => d.x) as DomainTime;
const yDomain: DomainLinear = [0, 5];

export function Demo() {
  return (
    <StyledDemo>
      <Title>Composable D3 chart</Title>
      <Chart>
        <DemoChart
          data={data}
          initialXDomain={maxXDomain}
          initialYDomain={yDomain}
          maxXDomain={maxXDomain}
        />
      </Chart>
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

const Chart = styled.div`
  height: 300px;
  margin: 32px;
  align-self: stretch;
  background-color: white;
`;
