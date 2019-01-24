import { extent } from 'd3-array';
import * as React from 'react';
import { css } from 'styled-components';
import { ChartState } from './D3Chart/ChartState';
import { D3Chart } from './D3Chart/D3Chart';
import { DomainLinear, DomainTime, Spacing } from './D3Chart/d3Chart.models';
import { Spline } from './D3Chart/Spline';
import { XAxis } from './D3Chart/XAxis';
import { createResource } from './dataFetcher';
import { xAccessor, yAccessor } from './Demo';

interface DemoChartProps {
  splineColor: string;
}

const margin: Spacing = { top: 5, right: 5, bottom: 20, left: 25 };

export function DemoChart(props: DemoChartProps) {
  const { splineColor } = props;

  const data = createResource(() =>
    fetch('https://api.iextrading.com/1.0/stock/aapl/chart')
  );

  const initialXDomain = extent(data, xAccessor) as DomainTime;
  const initialYDomain = [100, 200] as DomainLinear;

  return (
    <ChartState initialXDomain={initialXDomain} initialYDomain={initialYDomain}>
      {({ state: { xDomain, yDomain }, actions: { changeXDomain } }) => (
        <D3Chart
          margin={margin}
          xDomain={xDomain}
          maxXDomain={initialXDomain}
          yDomain={yDomain}
          xAccessor={xAccessor}
          data={data}
          onZoom={changeXDomain}
        >
          {({ xScale, yScale, contentSize }) => (
            <>
              <XAxis xScale={xScale} size={contentSize} />
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
