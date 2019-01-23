import { extent } from 'd3-array';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components/macro';

import { DomainLinear, DomainTime } from './D3Chart/d3Chart.models';
import { Datum, DemoChart } from './DemoChart';

const data: Datum[] = [
  { x: new Date('2019-01-01'), y: 2 },
  { x: new Date('2019-01-02'), y: 3 },
  { x: new Date('2019-01-03'), y: 1 },
  { x: new Date('2019-01-04'), y: 4 },
  { x: new Date('2019-01-05'), y: 5 },
];

const maxXDomain: DomainTime = extent(data, d => d.x) as DomainTime;
const yDomain: DomainLinear = [0, 5];

export function Demo() {
  const [splineColor, setSplineColor] = useState('#0088cc');

  return (
    <StyledDemo>
      <Title>Composable D3 chart</Title>
      <Chart>
        <DemoChart
          data={data}
          initialXDomain={maxXDomain}
          initialYDomain={yDomain}
          maxXDomain={maxXDomain}
          splineColor={splineColor}
        />
      </Chart>
      <button
        onClick={() =>
          setSplineColor(splineColor === '#ef5b5b' ? '#0088cc' : '#ef5b5b')
        }
      >
        Toggle color
      </button>
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
