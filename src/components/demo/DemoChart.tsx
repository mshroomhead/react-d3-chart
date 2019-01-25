import * as React from 'react';
import { css } from 'styled-components';
import { Spline } from '../d3Chart/components/Spline';
import { XAxis } from '../d3Chart/components/XAxis';
import { YAxis } from '../d3Chart/components/YAxis';
import { D3Chart } from '../d3Chart/D3Chart';
import { DomainLinear, DomainTime, Spacing } from '../d3Chart/models';
import { Datum, xAccessor, yAccessor } from './Demo';

interface DemoChartProps {
  data: Datum[];
  xDomain: DomainTime;
  yDomain: DomainLinear;
  color: string;
  animate: boolean;
  changeXDomain(domain: DomainTime): void;
}

const margin: Spacing = { top: 5, right: 5, bottom: 20, left: 26 };

export function DemoChart(props: DemoChartProps) {
  const { color, data, xDomain, yDomain, animate, changeXDomain } = props;

  return (
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
          <XAxis xScale={xScale} size={contentSize} animate={animate} />
          <YAxis yScale={yScale} />
          <Spline
            data={data}
            xScale={xScale}
            yScale={yScale}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
            animateScale={animate}
            styles={splineStyles(color)}
          />
        </>
      )}
    </D3Chart>
  );
}

const splineStyles = (color: string) => css`
  stroke: ${color};
  stroke-width: 2px;
`;
