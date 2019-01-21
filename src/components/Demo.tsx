import { extent } from 'd3-array';
import * as React from 'react';
import styled from 'styled-components/macro';
import { ChartState } from './D3Chart/ChartState';
import { D3Chart } from './D3Chart/D3Chart';
import { DomainLinear, DomainTime, Spacing } from './D3Chart/d3Chart.models';
import { XAxis } from './D3Chart/XAxis';

interface Datum {
  x: Date;
  y: number;
}

const xAccessor = (datum: Datum) => datum.x;

const data: Datum[] = [
  { x: new Date('2019-01-01'), y: 2 },
  { x: new Date('2019-01-15'), y: 3 },
  { x: new Date('2019-02-01'), y: 4 },
];

const margin: Spacing = { top: 5, right: 5, bottom: 20, left: 25 };
const maxXDomain: DomainTime = extent(data, d => d.x) as DomainTime;
const yDomain: DomainLinear = [0, 5];

export function Demo() {
  return (
    <StyledDemo>
      <Title>Composable D3 chart</Title>
      <Chart>
        <ChartState initialXDomain={maxXDomain} initialYDomain={yDomain}>
          {({ state: { xDomain, yDomain }, actions: { changeXDomain } }) => (
            <D3Chart
              margin={margin}
              xDomain={xDomain}
              maxXDomain={maxXDomain}
              yDomain={yDomain}
              xAccessor={xAccessor}
              data={data}
              onZoom={changeXDomain}
            >
              {({ xScale, yScale, contentSize }) => (
                <XAxis xScale={xScale} size={contentSize} />
              )}
            </D3Chart>
          )}
        </ChartState>
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
