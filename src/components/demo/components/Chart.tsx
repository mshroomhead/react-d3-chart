import * as React from 'react';
import { useContext } from 'react';
import { css } from 'styled-components';
import { Defs } from '../../d3Chart/components/Defs';
import { Spline } from '../../d3Chart/components/Spline';
import { XAxis } from '../../d3Chart/components/XAxis';
import { YAxis } from '../../d3Chart/components/YAxis';
import { D3Chart } from '../../d3Chart/D3Chart';
import { Spacing } from '../../d3Chart/models';
import { Datum, xAccessor, yAccessor } from '../Demo';
import { ChartContext } from '../statefull/ChartContext';

interface ChartProps {
  data: Datum[];
}

const margin: Spacing = { top: 5, right: 5, bottom: 20, left: 26 };
const contentClipPath = 'content';

export function Chart(props: ChartProps) {
  const { data } = props;
  const { state, actions } = useContext(ChartContext);
  const { xDomain, yDomain, animate, color } = state;
  const { changeXDomain } = actions;

  return (
    <D3Chart
      margin={margin}
      xDomain={xDomain!}
      yDomain={yDomain!}
      xAccessor={xAccessor}
      data={data}
      onZoom={changeXDomain}
    >
      {({ xScale, yScale, contentSize }) => (
        <>
          <Defs clipPaths={[{ id: contentClipPath, size: contentSize }]} />
          <XAxis xScale={xScale} size={contentSize} animate={animate} />
          <YAxis yScale={yScale} />
          <Spline
            data={data}
            xScale={xScale}
            yScale={yScale}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
            animateScale={animate}
            clipPathId={contentClipPath}
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
