import * as React from 'react';
import { ChartState } from './D3Chart/ChartState';
import { D3Chart } from './D3Chart/D3Chart';
import { DomainLinear, DomainTime, Spacing } from './D3Chart/d3Chart.models';
import { XAxis } from './D3Chart/XAxis';

interface DemoChartProps {
  data: Datum[];
  initialXDomain: DomainTime;
  initialYDomain: DomainLinear;
  maxXDomain: DomainTime;
}

export interface Datum {
  x: Date;
  y: number;
}

const xAccessor = (datum: Datum) => datum.x;
const margin: Spacing = { top: 5, right: 5, bottom: 20, left: 25 };

export function DemoChart(props: DemoChartProps) {
  const { data, initialXDomain, initialYDomain, maxXDomain } = props;

  return (
    <ChartState initialXDomain={initialXDomain} initialYDomain={initialYDomain}>
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
  );
}
