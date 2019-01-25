import { extent } from 'd3-array';
import * as React from 'react';
import { css } from 'styled-components';
import { ChartState } from '../d3Chart/components/ChartState';
import { Spline } from '../d3Chart/components/Spline';
import { XAxis } from '../d3Chart/components/XAxis';
import { YAxis } from '../d3Chart/components/YAxis';
import { D3Chart } from '../d3Chart/D3Chart';
import { DomainLinear, DomainTime, Spacing } from '../d3Chart/models';
import { Datum, xAccessor, yAccessor } from './Demo';
import { createResource } from './simpleCache';

interface DemoChartProps {
  splineColor: string;
}

const margin: Spacing = { top: 5, right: 5, bottom: 20, left: 26 };

export function DemoChart(props: DemoChartProps) {
  const { splineColor } = props;

  const data = createResource<Datum[]>(
    fetch('https://api.iextrading.com/1.0/stock/aapl/chart'),
    'data'
  );

  const initialXDomain = extent(data, xAccessor) as DomainTime;
  const initialYDomain = [100, 200] as DomainLinear;

  return (
    <ChartState initialXDomain={initialXDomain} initialYDomain={initialYDomain}>
      {({ state: { xDomain, yDomain }, actions: { changeXDomain } }) => (
        <D3Chart
          margin={margin}
          xDomain={xDomain}
          yDomain={yDomain}
          xAccessor={xAccessor}
          data={data}
          onZoom={changeXDomain}
        >
          {({ xScale, yScale, contentSize }) => (
            <>
              <XAxis xScale={xScale} size={contentSize} />
              <YAxis yScale={yScale} />
              <Spline
                data={data}
                xScale={xScale}
                yScale={yScale}
                xAccessor={xAccessor}
                yAccessor={yAccessor}
                styles={splineStyles(splineColor)}
              />
            </>
          )}
        </D3Chart>
      )}
    </ChartState>
  );
}

const splineStyles = (color: string) => css`
  stroke: ${color};
  stroke-width: 2px;
`;
