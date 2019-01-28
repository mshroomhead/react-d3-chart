import { extent } from 'd3-array';
import { default as React, useContext } from 'react';
import { DomainTime } from '../../d3Chart/models';
import { Datum, xAccessor } from '../Demo';
import { ChartContext } from '../statefull/ChartContext2';
import { createResource } from '../statefull/simpleCache';
import { Chart } from './Chart';

export function ChartWithData() {
  const { state, actions } = useContext(ChartContext);
  const { xDomain } = state;
  const { changeXDomain } = actions;

  const data = createResource<Datum[]>(
    fetch('https://api.iextrading.com/1.0/stock/aapl/chart'),
    'data'
  );

  if (!xDomain) {
    changeXDomain(extent(data, xAccessor) as DomainTime);
    return null;
  }

  return <Chart data={data} />;
}
